import { supabase } from './supabase';
import { User, UserRole } from "../types";

export const login = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Login failed");
  }

  return {
    id: data.user.id,
    username: data.user.user_metadata?.username || email,
    role: data.user.user_metadata?.role || UserRole.EDITOR
  };
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    username: session.user.user_metadata?.username || session.user.email || 'User',
    role: session.user.user_metadata?.role || UserRole.EDITOR
  };
};