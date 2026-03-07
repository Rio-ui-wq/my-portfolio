import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2zrqKga-cU924uS0KaSw2ncT7kHgo3Gs",
  authDomain: "my-portfolio-884af.firebaseapp.com",
  projectId: "my-portfolio-884af",
  storageBucket: "my-portfolio-884af.firebasestorage.app",
  messagingSenderId: "684717750812",
  appId: "1:684717750812:web:4c6029abd484a1bec83dd9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signOutUser = () => signOut(auth);