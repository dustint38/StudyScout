import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { app, db } from "../config/firebase";

const auth = getAuth(app);

export const signUp = async (email: string, password: string, name: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", credential.user.uid), {
    id: credential.user.uid,
    name,
    email,
    createdAt: new Date(),
  });
  return credential;
};

export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  return await signOut(auth);
};

export const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
};
