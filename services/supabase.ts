import { createClient } from '@supabase/supabase-js';

// Robust environment variable detection
const getEnv = (key: string): string | undefined => {
  // Check common locations for environment variables
  if (typeof (window as any).process !== 'undefined' && (window as any).process.env) {
    return (window as any).process.env[key];
  }
  
  // Vite / ESM context
  try {
    return (import.meta as any).env[key];
  } catch (e) {
    return undefined;
  }
};

export const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');
export const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

// We use a safe placeholder to prevent the constructor from throwing a hard error 
// that stops the whole app from mounting.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("FBC Website: Supabase keys not found. Database features will be disabled.");
}