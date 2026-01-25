import { createClient } from '@supabase/supabase-js';

// Safely access environment variables. 
// We default to an empty object if (import.meta as any).env is undefined to prevent crashes.
const env = (import.meta as any).env || {};

export const supabaseUrl = env.VITE_SUPABASE_URL;
export const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase Environment Variables are missing. Please check your .env file or Netlify settings.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);