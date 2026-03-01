// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBu3srYuhBJXBr_MO6WZOCSYf0FxArBS8A",
  authDomain: "true-eats.firebaseapp.com",
  projectId: "true-eats",
  storageBucket: "true-eats.firebasestorage.app",
  messagingSenderId: "674118583841",
  appId: "1:674118583841:web:6851261a25b778b5e94560",
  measurementId: "G-02C6ER4NB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);