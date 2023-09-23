import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC0Spd-hWNRWBXxBy9Yk9s0hi3S-L3t0XM",
  authDomain: "fir-react-35bab.firebaseapp.com",
  projectId: "fir-react-35bab",
  storageBucket: "fir-react-35bab.appspot.com",
  messagingSenderId: "679499377605",
  appId: "1:679499377605:web:67d7fbbadc0964b119f9ac",
  measurementId: "G-B6H3T5S7S0",
};

const app = initializeApp(firebaseConfig);
// autenticacion
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// base de datos
export const db = getFirestore(app);
export const storage = getStorage(app);
