import { User } from "../types";
import { getUsers } from "./db";

// Mock Auth key
const KEY_CURRENT_USER = 'fbc_ep_current_user';

export const login = async (username: string, password: string): Promise<User> => {
  const users = await getUsers();
  const user = users.find((u: any) => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Sanitize user object (remove password)
  const safeUser: User = {
    id: user.id,
    username: user.username,
    role: user.role
  };

  localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(safeUser));
  return safeUser;
};

export const logout = () => {
  localStorage.removeItem(KEY_CURRENT_USER);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(KEY_CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};