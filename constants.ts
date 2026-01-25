import { ServiceTime } from "./types";

// --- SUPABASE CONFIGURATION ---
// TODO: Replace these with your actual Project URL and Anon Key from Supabase Dashboard > Settings > API
export const SUPABASE_URL = "https://your-project-id.supabase.co";
export const SUPABASE_ANON_KEY = "your-anon-public-key-goes-here";

// --- ASSETS ---
export const ASSETS = {
  // Using placeholders that match the user's description flavor
  STAINED_GLASS_MAIN: 'https://images.unsplash.com/photo-1576510967347-6df1292027b6?q=80&w=1920&auto=format&fit=crop', 
  STAINED_GLASS_ZOOM: 'https://images.unsplash.com/photo-1491566102026-b924dc1c569f?q=80&w=800&auto=format&fit=crop',
  BUILDING_EXTERIOR: 'https://images.unsplash.com/photo-1548625361-1b96a9c80d83?q=80&w=1920&auto=format&fit=crop',
  STREAMING_LOGO: 'https://img.icons8.com/ios-filled/100/1e3a8a/dove.png', // Placeholder for the dove logo
};

export const CHURCH_INFO = {
  name: "First Baptist Church East Prairie",
  address: "205 Pearl St, East Prairie, MO 63845",
  phone: "(573) 649-5781",
  facebookUrl: "https://www.facebook.com/fbceastprairie",
  youtubeUrl: "https://www.youtube.com/@FirstBaptistEastPrairie",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=205+Pearl+St,+East+Prairie,+MO+63845",
};

export const SERVICE_TIMES: ServiceTime[] = [
  { day: "Sunday", time: "9:30 AM", label: "Sunday School" },
  { day: "Sunday", time: "10:30 AM", label: "Worship Service" },
  { day: "Sunday", time: "5:00 PM", label: "Evening Service" },
  { day: "Wednesday", time: "6:00 PM", label: "Mid-Week Service" },
];