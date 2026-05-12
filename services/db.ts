import { collection, getDocs, doc, getDoc, addDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { User } from "../types";
import { StudySpot } from "../types";

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

// Get the current user's rating for a spot (null if not yet rated)
export const getUserRating = async (spotId: string, userId: string): Promise<number | null> => {
  const snap = await getDoc(doc(db, "studySpots", spotId, "ratings", userId));
  return snap.exists() ? (snap.data().value as number) : null;
};

// Submit or update a user's rating, keeping the spot's average in sync
export const submitRating = async (spotId: string, userId: string, value: number): Promise<void> => {
  const spotRef = doc(db, "studySpots", spotId);
  const ratingRef = doc(db, "studySpots", spotId, "ratings", userId);

  await runTransaction(db, async (tx) => {
    const [spotSnap, ratingSnap] = await Promise.all([tx.get(spotRef), tx.get(ratingRef)]);
    if (!spotSnap.exists()) throw new Error("Spot not found");

    const { rating = 0, ratingCount = 0 } = spotSnap.data();
    let newCount: number;
    let newAvg: number;

    if (ratingSnap.exists()) {
      const oldValue = ratingSnap.data().value as number;
      newCount = ratingCount;
      newAvg = ratingCount > 0 ? (rating * ratingCount - oldValue + value) / ratingCount : value;
    } else {
      newCount = ratingCount + 1;
      newAvg = (rating * ratingCount + value) / newCount;
    }

    tx.set(ratingRef, { value, updatedAt: serverTimestamp() });
    tx.update(spotRef, { rating: newAvg, ratingCount: newCount });
  });
};