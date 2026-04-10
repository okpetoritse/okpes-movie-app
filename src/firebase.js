import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDWU-whZ-wAMQYmgnexFGuarq1rTNRbRU",
  authDomain: "myflix-3b5f9.firebaseapp.com",
  projectId: "myflix-3b5f9",
  storageBucket: "myflix-3b5f9.firebasestorage.app",
  messagingSenderId: "2115596145",
  appId: "1:2115596145:web:3d4a9f379a6fea9fa0d0d0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
