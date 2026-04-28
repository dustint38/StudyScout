import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { StudySpot } from "../types";

export const useStudySpots = () => {
  const [spots, setSpots] = useState<StudySpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "studySpots"),
      (snap) => {
        setSpots(snap.docs.map(d => ({ id: d.id, ...d.data() } as StudySpot)));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub; // cleans up listener when you leave the screen
  }, []);

  return { spots, loading, error };
};