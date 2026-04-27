import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMxphW8Sd3gpnsw1uoi7Wz_vI_ZKa4oIE",
  authDomain: "studyscout-4b018.firebaseapp.com",
  projectId: "studyscout-4b018",
  storageBucket: "studyscout-4b018.firebasestorage.app",
  messagingSenderId: "552198010607",
  appId: "1:552198010607:web:f0ba07a352111e22674d1a",
  measurementId: "G-4XGVCBHVL8",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
