import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAY9zgMMP_kLKdwgqnxxqfbviGJLVXduI",
  authDomain: "kumshot-6ebc5.firebaseapp.com",
  projectId: "kumshot-6ebc5",
  storageBucket: "kumshot-6ebc5.firebasestorage.app",
  messagingSenderId: "327933009202",
  appId: "1:327933009202:web:50ce58ee3c4bcbfa138b2b",
  measurementId: "G-1DHQZCR1FF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializamos los servicios que usaremos para "acceso" (Auth) y "modificaciones" (Firestore)
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
