
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLYn1O3gZDT0hNUBCvjlGKbRdxTy7WJ-s",
  authDomain: "speqtrum-project.firebaseapp.com",
  projectId: "speqtrum-project",
  storageBucket: "speqtrum-project.firebasestorage.app",
  messagingSenderId: "55134087234",
  appId: "1:55134087234:web:420361cd037e543e0e65db",
  measurementId: "G-VZLZJ9RE5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Firebase Analytics not supported in this environment");
}
export { analytics };
export const auth = getAuth(app);
export const db = getFirestore(app);
