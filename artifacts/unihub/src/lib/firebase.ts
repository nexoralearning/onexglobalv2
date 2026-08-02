import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCvJfRbre-kZNpJvLsqCcWmHlI1307bZNU",
  authDomain: "onexglobal-98a5a.firebaseapp.com",
  projectId: "onexglobal-98a5a",
  storageBucket: "onexglobal-98a5a.firebasestorage.app",
  messagingSenderId: "153682909245",
  appId: "1:153682909245:web:ad132648cdb5ee2d2eb254"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);


