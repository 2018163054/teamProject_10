import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFBPRFuEcXgGKSfP16WT69pLveBQcOSzs",
  authDomain: "barrier-free-24cfb.firebaseapp.com",
  projectId: "barrier-free-24cfb",
  storageBucket: "barrier-free-24cfb.firebasestorage.app",
  messagingSenderId: "99297051213",
  appId: "1:99297051213:web:1cf7e4c7e3f5e746d41204",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
