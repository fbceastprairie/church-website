import { ServiceTime } from "./types";

// In a real deployment, these would point to the actual uploaded files.
// For this demo, we use variables so the user can easily swap them later.
// Note: If you place the user's images in a 'public/assets' folder, update these paths.
export const ASSETS = {
  // Using placeholders that match the user's description flavor
  STAINED_GLASS_MAIN: 'https://images.unsplash.com/photo-1576510967347-6df1292027b6?q=80&w=1920&auto=format&fit=crop', 
  STAINED_GLASS_ZOOM: 'https://images.unsplash.com/photo-1491566102026-b924dc1c569f?q=80&w=800&auto=format&fit=crop',
  BUILDING_EXTERIOR: 'https://images.unsplash.com/photo-1548625361-1b96a9c80d83?q=80&w=1920&auto=format&fit=crop',
  
  // INSTRUCTION: To use your own logo, right-click your logo on Facebook or your old site, 
  // select "Copy Image Address", and paste it inside the quotes below.
  // Example: 'https://scontent.fmem1-2.fna.fbcdn.net/...'
  STREAMING_LOGO: '/fbc-logo.png', 
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