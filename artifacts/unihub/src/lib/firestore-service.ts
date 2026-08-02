import {
  collection,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, auth, storage } from "./firebase";
import { getCurrentPlan, setPlan, type Plan } from "./plan";

export interface UserDoc {
  displayName: string;
  email: string;
  plan: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  folderId?: string;
  size: string;
  type?: string;
  storagePath?: string;
  downloadURL?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  createdAt: string;
}

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path,
  };
  console.warn("Firestore sync notice (offline or rules fallback):", errInfo.error);
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// ------------------------------------
// USER PROFILE DOC
// ------------------------------------
export async function ensureUserDoc(uid: string, email: string, displayName?: string) {
  const userRef = doc(db, "users", uid);
  try {
    const snap = await getDoc(userRef);
    const localPlan = getCurrentPlan();

    if (!snap.exists()) {
      await setDoc(userRef, {
        displayName: displayName || email.split("@")[0] || "User",
        email: email,
        plan: localPlan,
        createdAt: new Date().toISOString(),
      });
    } else {
      const data = snap.data();
      if (data.plan && (data.plan === "basic" || data.plan === "premium" || data.plan === "free")) {
        setPlan(data.plan as Plan);
      } else if (localPlan !== "free") {
        await updateDoc(userRef, { plan: localPlan, updatedAt: new Date().toISOString() });
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
  }
}

// ------------------------------------
// FOLDERS
// ------------------------------------
export function subscribeFolders(
  uid: string,
  onUpdate: (folders: Folder[]) => void,
  onError?: (error: Error) => void
) {
  const path = `users/${uid}/folders`;
  const q = query(collection(db, path), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const folders: Folder[] = snapshot.docs.map((d) => ({
        id: d.id,
        name: d.data().name || "",
        createdAt: d.data().createdAt || new Date().toISOString(),
      }));
      onUpdate(folders);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
      onError?.(err as Error);
    }
  );
}

export async function createFolder(uid: string, name: string): Promise<string> {
  const path = `users/${uid}/folders`;
  try {
    const docRef = await addDoc(collection(db, path), {
      name: name.trim(),
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function deleteFolder(uid: string, folderId: string): Promise<void> {
  const path = `users/${uid}/folders/${folderId}`;
  try {
    await deleteDoc(doc(db, "users", uid, "folders", folderId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ------------------------------------
// FILES & FIREBASE STORAGE
// ------------------------------------
export function subscribeFiles(
  uid: string,
  onUpdate: (files: FileItem[]) => void,
  onError?: (error: Error) => void
) {
  const path = `users/${uid}/files`;
  const q = query(collection(db, path), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const files: FileItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        let createdAt = new Date().toISOString();
        if (data.createdAt) {
          if (typeof data.createdAt === "string") {
            createdAt = data.createdAt;
          } else if (data.createdAt?.toDate) {
            createdAt = data.createdAt.toDate().toISOString();
          }
        }
        return {
          id: d.id,
          name: data.name || "",
          folderId: data.folderId || "",
          size: data.size || "0 KB",
          type: data.type || "application/octet-stream",
          storagePath: data.storagePath || "",
          downloadURL: data.downloadURL || "",
          createdAt,
        };
      });
      onUpdate(files);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
      onError?.(err as Error);
    }
  );
}

export function uploadFileToStorage(
  uid: string,
  file: File,
  folderId?: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const fileId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const storagePath = `user_uploads/${uid}/${fileId}-${cleanFileName}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(progress);
      },
      (error) => {
        console.error("Storage upload error:", error);
        reject(new Error(error.message || "Upload failed"));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const path = `users/${uid}/files`;
          const docRef = await addDoc(collection(db, path), {
            name: file.name,
            storagePath,
            downloadURL,
            size: formatBytes(file.size),
            type: file.type || "application/octet-stream",
            folderId: folderId || "",
            createdAt: new Date().toISOString(),
          });
          resolve(docRef.id);
        } catch (err) {
          console.error("Firestore metadata save error:", err);
          reject(err);
        }
      }
    );
  });
}

export async function createFile(
  uid: string,
  data: { name: string; folderId?: string; size: string }
): Promise<string> {
  const path = `users/${uid}/files`;
  try {
    const docRef = await addDoc(collection(db, path), {
      name: data.name.trim(),
      folderId: data.folderId || "",
      size: data.size.trim() || "1.0 MB",
      type: "document",
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function deleteFileItemAndStorage(
  uid: string,
  file: FileItem
): Promise<void> {
  const path = `users/${uid}/files/${file.id}`;
  if (file.storagePath) {
    try {
      const fileRef = ref(storage, file.storagePath);
      await deleteObject(fileRef);
    } catch (err) {
      console.warn("Storage delete file warning:", err);
    }
  }
  try {
    await deleteDoc(doc(db, "users", uid, "files", file.id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

export async function deleteFileItem(uid: string, fileId: string): Promise<void> {
  const path = `users/${uid}/files/${fileId}`;
  try {
    await deleteDoc(doc(db, "users", uid, "files", fileId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ------------------------------------
// NOTES
// ------------------------------------

export function subscribeNotes(
  uid: string,
  onUpdate: (notes: Note[]) => void,
  onError?: (error: Error) => void
) {
  const path = `users/${uid}/notes`;
  const q = query(collection(db, path), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const notes: Note[] = snapshot.docs.map((d) => ({
        id: d.id,
        title: d.data().title || "",
        content: d.data().content || "",
        createdAt: d.data().createdAt || new Date().toISOString(),
      }));
      onUpdate(notes);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
      onError?.(err as Error);
    }
  );
}

export async function createNote(
  uid: string,
  data: { title: string; content?: string }
): Promise<string> {
  const path = `users/${uid}/notes`;
  try {
    const docRef = await addDoc(collection(db, path), {
      title: data.title.trim(),
      content: (data.content || "").trim(),
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function deleteNote(uid: string, noteId: string): Promise<void> {
  const path = `users/${uid}/notes/${noteId}`;
  try {
    await deleteDoc(doc(db, "users", uid, "notes", noteId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ------------------------------------
// TEAM MEMBERS
// ------------------------------------
export function subscribeTeamMembers(
  uid: string,
  onUpdate: (members: TeamMember[]) => void,
  onError?: (error: Error) => void
) {
  const path = `users/${uid}/teamMembers`;
  const q = query(collection(db, path), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const members: TeamMember[] = snapshot.docs.map((d) => ({
        id: d.id,
        name: d.data().name || "",
        role: d.data().role || "Member",
        createdAt: d.data().createdAt || new Date().toISOString(),
      }));
      onUpdate(members);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
      onError?.(err as Error);
    }
  );
}

export async function createTeamMember(
  uid: string,
  data: { name: string; role?: string }
): Promise<string> {
  const path = `users/${uid}/teamMembers`;
  try {
    const docRef = await addDoc(collection(db, path), {
      name: data.name.trim(),
      role: (data.role || "Member").trim(),
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function deleteTeamMember(uid: string, memberId: string): Promise<void> {
  const path = `users/${uid}/teamMembers/${memberId}`;
  try {
    await deleteDoc(doc(db, "users", uid, "teamMembers", memberId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}
