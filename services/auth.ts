

import { supabase } from './supabase.ts';
import { User, UserRole } from "../types.ts";

const SUPER_ADMIN_EMAILS: string[] = ["jace.barnett@gmail.com"];

const determineRole = (user: any): UserRole => {
  if (user.email && SUPER_ADMIN_EMAILS.includes(user.email)) return UserRole.ADMIN;
  const metaRole = user.user_metadata?.role;
  if (metaRole === 'ADMIN') return UserRole.ADMIN;
  return UserRole.EDITOR;
};

export const login = async (email: string, password: string): Promise<User> => {
  /* Fixed: Use V2 style signInWithPassword and handle data.user */
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  
  const user = data?.user;
  if (!user) throw new Error("Login failed");

  return {
    id: user.id,
    username: user.user_metadata?.username || email.split('@')[0],
    role: determineRole(user)
  };
};

export const logout = async () => {
  /* Fixed: Use V2 style signOut */
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
  /* Fixed: Use V2 style getSession() instead of the deprecated session() method */
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  return {
    id: session.user.id,
    username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
    role: determineRole(session.user)
  };
};

export const updatePassword = async (password: string): Promise<void> => {
  /* Fixed: Use V2 style updateUser() instead of the deprecated update() method */
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
};