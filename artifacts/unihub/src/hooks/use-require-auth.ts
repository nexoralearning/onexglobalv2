import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { User } from "@/lib/auth";
import { getCurrentUser, mapFirebaseUser } from "@/lib/auth";
import { ensureUserDoc } from "@/lib/firestore-service";

export function useRequireAuth(): User | null {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const mapped = mapFirebaseUser(firebaseUser);
        setUser(mapped);
        ensureUserDoc(mapped.id, mapped.email, mapped.name);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return user;
}

