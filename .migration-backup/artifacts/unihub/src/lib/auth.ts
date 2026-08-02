import { getStorage, setStorage, removeStorage } from './storage';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // stored in real life securely, plain for MVP
  university: string;
  country: string;
  degree: string;
  year: number;
  bio?: string;
  avatarUrl?: string;
}

const USERS_KEY = 'unihub_users';
const SESSION_KEY = 'unihub_session';

export function getUsers(): User[] {
  return getStorage<User[]>(USERS_KEY, []);
}

export function saveUser(user: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.email === user.email);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  setStorage(USERS_KEY, users);
}

export function login(email: string): void {
  setStorage(SESSION_KEY, email);
}

export function logout(): void {
  removeStorage(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const email = getStorage<string | null>(SESSION_KEY, null);
  if (!email) return null;
  const users = getUsers();
  return users.find(u => u.email === email) || null;
}
