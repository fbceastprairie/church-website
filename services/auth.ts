import { supabase } from './supabase';
import { User, UserRole } from "../types";

// SAFETY: Add your specific email here to guarantee Admin access.
// This overrides the database setting, ensuring you never get locked out.
const SUPER_ADMIN_EMAILS: string[] = [
  // "your.email@example.com", 
  "jace.barnett@gmail.com", 
];

// Helper to determine role.
const determineRole = (user: any): UserRole => {
  // 1. Check Super Admin list (Code Override)
  // This allows the site owner to always be Admin without messing with DB metadata.
  if (user.email && SUPER_ADMIN_EMAILS.includes(user.email)) {
    return UserRole.ADMIN;
  }

  // 2. Check Database Metadata
  const metaRole = user.user_metadata?.role;
  if (metaRole === 'ADMIN') return UserRole.ADMIN;
  if (metaRole === 'EDITOR') return UserRole.EDITOR;

  // 3. Default Fallback
  // New users created in Supabase Dashboard default to EDITOR for security.
  // This ensures you can safely add volunteers without giving them full site control.
  return UserRole.EDITOR;
};

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
    // Use the part of the email before '@' as a username if one isn't set
    username: data.user.user_metadata?.username || email.split('@')[0],
    role: determineRole(data.user)
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
    username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
    role: determineRole(session.user)
  };
};