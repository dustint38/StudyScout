// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMxphW8Sd3gpnsw1uoi7Wz_vI_ZKa4oIE",
  authDomain: "studyscout-4b018.firebaseapp.com",
  projectId: "studyscout-4b018",
  storageBucket: "studyscout-4b018.firebasestorage.app",
  messagingSenderId: "552198010607",
  appId: "1:552198010607:web:f0ba07a352111e22674d1a",
  measurementId: "G-4XGVCBHVL8"
};

// Initialize Firebase
/*const app = initializeApp(firebaseConfig);
const db = getAnalytics(app);*/


export { app };
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
