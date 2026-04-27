import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { User } from "../types";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as User)));
    });
    return unsub; // cleans up listener on unmount
  }, []);

  return users;
};