import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { db } from "../config/firebase";
import { User } from "../types";
import { StudySpot } from "../types";

// Compress + downscale a local image and return a data URI safe for Firestore (<1MB doc limit)
export const compressImageToDataUri = async (localUri: string): Promise<string> => {
  const context = ImageManipulator.manipulate(localUri);
  context.resize({ width: 800 });
  const image = await context.renderAsync();
  const result = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.5, base64: true });
  return `data:image/jpeg;base64,${result.base64}`;
};

export const getUser = async (id: string): Promise<User | null> => {
  const snap = await getDoc(doc(db, "users", id));
  return snap.exists() ? (snap.data() as User) : null;
};

export const getUsers = async (): Promise<User[]> => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

//get all study spots
export const getStudySpots = async (): Promise<StudySpot[]> => {
  const snap = await getDocs(collection(db, "studySpots"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as StudySpot));
};

// Get a single study spot by ID
export const getStudySpot = async (id: string): Promise<StudySpot | null> => {
  const snap = await getDoc(doc(db, "studySpots", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as StudySpot) : null;
};

// Add a new study spot
export const addStudySpot = async (spot: Omit<StudySpot, "id">): Promise<void> => {
  await addDoc(collection(db, "studySpots"), spot);
};