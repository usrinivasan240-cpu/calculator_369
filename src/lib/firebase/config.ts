import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "firecalc-123-70982229-636dc",
  "appId": "1:747789200924:web:e1f318e6d3fbd226f0f9d9",
  "storageBucket": "firecalc-123-70982229-636dc.appspot.com",
  "apiKey": "AIzaSyD_r1g1BX0lb2XbhwakEg3OX-5-14zcbf4",
  "authDomain": "firecalc-123-70982229-636dc.firebaseapp.com",
  "messagingSenderId": "747789200924"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
