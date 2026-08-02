import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";

export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  country: string;
  degree: string;
  year: number;
  bio?: string | null;
  avatarUrl?: string | null;
  emailVerified?: boolean;
}

export function mapFirebaseUser(
  firebaseUser: FirebaseUser,
  extraData?: Partial<User>
): User {
  const displayName = firebaseUser.displayName || extraData?.name || firebaseUser.email?.split("@")[0] || "Student";
  return {
    id: firebaseUser.uid,
    name: displayName,
    email: firebaseUser.email || "",
    university: extraData?.university || "University",
    country: extraData?.country || "Global",
    degree: extraData?.degree || "Undergraduate",
    year: extraData?.year || 1,
    bio: extraData?.bio || null,
    avatarUrl: firebaseUser.photoURL || extraData?.avatarUrl || null,
    emailVerified: firebaseUser.emailVerified,
  };
}

export function getCurrentUser(): User | null {
  if (auth.currentUser && auth.currentUser.emailVerified) {
    return mapFirebaseUser(auth.currentUser);
  }
  return null;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function loginWithApi(email: string, password: string): Promise<User> {
  let cred;
  try {
    cred = await signInWithEmailAndPassword(auth, email, password);
  } catch {
    throw new Error("Email or password is incorrect");
  }

  if (!cred.user.emailVerified) {
    const unverifiedEmail = cred.user.email || email;
    await signOut(auth);
    throw new Error(`EMAIL_NOT_VERIFIED:${unverifiedEmail}`);
  }

  return mapFirebaseUser(cred.user);
}

export async function registerWithApi(data: {
  name: string;
  email: string;
  password: string;
  university: string;
  country: string;
  degree: string;
  year: number;
}): Promise<{ emailSent: boolean; email: string }> {
  let cred;
  try {
    cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || "";
    if (code === "auth/email-already-in-use") {
      throw new Error("User already exists. Please sign in");
    }
    if (code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters");
    }
    if (code === "auth/invalid-email") {
      throw new Error("Invalid email address format");
    }
    throw new Error((err as Error)?.message || "Registration failed");
  }

  try {
    await sendEmailVerification(cred.user);
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }

  await signOut(auth);
  return { emailSent: true, email: data.email };
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return mapFirebaseUser(cred.user);
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || "";
    if (code === "auth/popup-closed-by-user") {
      throw new Error("Google sign-in was cancelled");
    }
    throw new Error((err as Error)?.message || "Google sign-in failed");
  }
}

export async function updateProfile(
  data: Partial<Omit<User, "id" | "email">>
): Promise<User> {
  const current = getCurrentUser();
  if (!current) throw new Error("No user logged in");
  return { ...current, ...data };
}

export const updateProfileWithApi = updateProfile;
