import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  Auth
} from "firebase/auth";
import { auth as defaultAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (auth: Auth = defaultAuth) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, auth: Auth = defaultAuth) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error("Error signing up with email: ", error);
        throw error;
    }
}

export const signInWithEmail = async (email: string, password: string, auth: Auth = defaultAuth) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error("Error signing in with email: ", error);
        throw error;
    }
}

export const signOut = async (auth: Auth = defaultAuth) => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};
