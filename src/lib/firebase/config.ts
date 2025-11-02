import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-769582766-e0d9c",
  "appId": "1:468968171965:web:9cf31b631e4f261f6ecad4",
  "storageBucket": "studio-769582766-e0d9c.appspot.com",
  "apiKey": "AIzaSyDouG-GFi4OFSx3zX5SCv6DH9MF7XNT1zc",
  "authDomain": "studio-769582766-e0d9c.firebaseapp.com",
  "messagingSenderId": "468968171965"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
