import { createClient } from '@supabase/supabase-js';

// Fix: Cast import.meta to any to resolve "Property 'env' does not exist on type 'ImportMeta'"
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase Environment Variables are missing. Please check your .env file or Netlify settings.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);