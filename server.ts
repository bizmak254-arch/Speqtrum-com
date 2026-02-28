import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "./services/db";
import multer from "multer";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const JWT_SECRET = process.env.JWT_SECRET || "speqtrum-secret-key";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia" as any,
});

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

async function startServer() {
  console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);
  try {
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    const PORT = 3000;

    // Middleware
    app.use(express.json());
    app.use(cookieParser());
    app.use("/uploads", express.static("uploads"));

    // API routes
    app.get("/api/auth/me", async (req, res) => {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Not authenticated" });

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
      } catch (error) {
        res.status(401).json({ error: "Invalid token" });
      }
    });

    app.post("/api/auth/login", async (req, res) => {
      const { email, displayName, id } = req.body;
      
      try {
        const user = await prisma.user.upsert({
          where: { email },
          update: { displayName },
          create: { id: id || undefined, email, displayName, subscriptionTier: 'standard' }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
        
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json(user);
      } catch (error) {
        res.status(500).json({ error: "Login failed" });
      }
    });

    app.post("/api/auth/logout", (req, res) => {
      res.clearCookie("token");
      res.json({ success: true });
    });

    app.post("/api/upload", upload.single("file"), (req: any, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    });

    app.post("/api/create-checkout-session", async (req, res) => {
      const { priceId, userId } = req.body;
      
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: priceId, // e.g., 'price_123'
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${process.env.APP_URL || 'http://localhost:3000'}/?payment=success`,
          cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/?payment=cancel`,
          metadata: { userId },
        });

        res.json({ url: session.url });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      socket.on("send_message", async (data) => {
        // data: { roomId, senderId, text, flagged, timestamp }
        try {
          // Ensure user exists (for demo, we'll create if not exists)
          await prisma.user.upsert({
            where: { id: data.senderId },
            update: {},
            create: {
              id: data.senderId,
              email: `${data.senderId}@example.com`,
              displayName: data.senderId === 'them_bot' ? 'Speqtrum Bot' : 'User'
            }
          });

          const savedMessage = await prisma.message.create({
            data: {
              text: data.text,
              senderId: data.senderId,
              roomId: data.roomId,
              flagged: data.flagged || false,
            }
          });

          io.to(data.roomId).emit("receive_message", {
            ...data,
            id: savedMessage.id,
            timestamp: savedMessage.createdAt
          });
        } catch (error) {
          console.error("Error saving message:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // API routes FIRST
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", env: process.env.NODE_ENV || 'development' });
    });

    app.get("/api/messages/:roomId", async (req, res) => {
      const { roomId } = req.params;
      try {
        const messages = await prisma.message.findMany({
          where: { roomId },
          orderBy: { createdAt: 'asc' },
          include: { sender: true }
        });
        res.json(messages);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
      }
    });

    // OAuth Endpoints
    app.get('/api/auth/url', (req, res) => {
      // Example: Google OAuth
      // In a real app, these would be environment variables
      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
      const REDIRECT_URI = `${req.protocol}://${req.get('host')}/auth/callback`;
      
      if (!CLIENT_ID) {
        return res.status(500).json({ error: "OAuth not configured" });
      }

      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'profile email',
        access_type: 'offline',
        prompt: 'consent'
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
      res.json({ url: authUrl });
    });

    app.get(['/auth/callback', '/auth/callback/'], (req, res) => {
      // This is the popup window that receives the code
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', code: '${req.query.code}' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. Closing...</p>
          </body>
        </html>
      `);
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Initializing Vite middleware...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      console.log("Serving static files from dist...");
      app.use(express.static("dist"));
      // SPA fallback
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
      });
    }

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
