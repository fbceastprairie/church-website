
import { ServiceTime } from "./types.ts";

// In a real deployment, these would point to the actual uploaded files.
// For this demo, we use variables so the user can easily swap them later.
// Note: If you place the user's images in a 'public/assets' folder, update these paths.
export const ASSETS = {
  // Using placeholders that match the user's description flavor
  STAINED_GLASS_MAIN: '/stained_glass_mural_we_are_known_locally_for.jpg', 
  STAINED_GLASS_ZOOM: '/zoomed_in_stained_glass_mural.jpg',
  BUILDING_EXTERIOR: '/ourChurchBuildingAndFlags.jpg',
  
  // INSTRUCTION: Place your logo image inside the 'public' folder and name it 'logo.png'.
  // The host (Vercel/Netlify) will serve this file from the root of your domain.
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
  { day: "Wednesday", time: "6:00 PM", label: "Wednesday Bible Study" },
];
