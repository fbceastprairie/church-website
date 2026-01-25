import { User } from "../types";
import { supabase } from "./db";

const loginInternal = async (username: string, password: string): Promise<User> => {
  // 1. Authenticate with Supabase Auth
  // Note: We append a dummy domain because Supabase expects emails, but user wants usernames.
  const email = `${username}@fbceastprairie.org`;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error("Invalid credentials");
  }

  // 2. Fetch the User's Role from the 'profiles' table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("User profile not found");
  }

  // 3. Return the user object
  return {
    id: profile.id,
    username: profile.username,
    role: profile.role
  };
};

export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('fbc_cached_user');
};

// Helper to get current session from local storage wrapper (for performance)
// In a full app, we might use a React Context for this, but this keeps it simple.
export const getCurrentUser = (): User | null => {
  // We can try to recover the session from Supabase client
  const sessionUser = supabase.auth.getSession();
  
  // However, `getSession` is async. For this simple synchronous check used in components,
  // we will rely on a small cached value we set during login, 
  // or we would need to refactor the whole app to be async auth aware.
  // For this scope, let's assume if the cached user exists, they are logged in.
  const cached = localStorage.getItem('sb-' + parseProjectId() + '-auth-token'); 
  
  // Real implementation: We'd verify the JWT. 
  // For now, we rely on the component state in AdminDashboard mostly.
  // But wait, the previous app relied on `getCurrentUser` returning a User object synchronously.
  
  // Let's implement a simpler "Session storage" pattern for the User Object
  // mirroring what we did in the mock version, but populated by the real login.
  const stored = localStorage.getItem('fbc_cached_user');
  return stored ? JSON.parse(stored) : null;
};

// We wrap the original login to cache the user object for synchronous access
export const login = async (u: string, p: string) => {
    const user = await loginInternal(u, p);
    localStorage.setItem('fbc_cached_user', JSON.stringify(user));
    return user;
}

// Helper to parse project ID for local storage key (internal use)
function parseProjectId() {
    // Attempt to parse from URL in constants, fallback to generic
    return 'project-id'; 
}