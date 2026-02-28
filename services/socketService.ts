import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      // In development, the dev server and the socket server are the same
      this.socket = io();
      
      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });
    }
    return this.socket;
  }

  joinRoom(roomId: string) {
    this.socket?.emit("join_room", roomId);
  }

  sendMessage(roomId: string, senderId: string, text: string, flagged: boolean = false) {
    this.socket?.emit("send_message", {
      roomId,
      senderId,
      text,
      flagged,
      timestamp: new Date().toISOString()
    });
  }

  onMessage(callback: (data: any) => void) {
    this.socket?.on("receive_message", callback);
  }

  offMessage() {
    this.socket?.off("receive_message");
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
