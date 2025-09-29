// src/firebase/config.js
import { initializeApp } from "firebase/app";

// TODO: Replace this with your own Firebase project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyDr3SbdV0yFyraUV5piImNwmTCLPy3lu-M",
  authDomain: "internlink-dca18.firebaseapp.com",
  projectId: "internlink-dca18",
  storageBucket: "internlink-dca18.firebasestorage.app",
  messagingSenderId: "690591004296",
  appId: "1:690591004296:web:12509fbd8f3aff397c913d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
