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

  // If role is not explicitly set in metadata, we default to ADMIN.
  // This ensures users created manually in the Supabase dashboard have admin access.
  const role = (data.user.user_metadata?.role as UserRole) || UserRole.ADMIN;

  return {
    id: data.user.id,
    // Use the part of the email before '@' as a username if one isn't set
    username: data.user.user_metadata?.username || email.split('@')[0],
    role: role
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

  const role = (session.user.user_metadata?.role as UserRole) || UserRole.ADMIN;

  return {
    id: session.user.id,
    username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
    role: role
  };
};