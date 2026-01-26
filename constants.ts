import { ServiceTime } from "./types.ts";

// Replaced broken local paths with Unsplash placeholders so the site works immediately.
// TO USE YOUR OWN IMAGES:
// 1. Upload your files to the 'public' folder.
// 2. Update these paths to match (e.g., '/my-church.jpg').
export const ASSETS = {
  // Beautiful stained glass background
  STAINED_GLASS_MAIN: '/stained_glass_mural_we_are_known_locally_for.jpg', 
  
  // Detailed texture for other sections (optional)
  STAINED_GLASS_ZOOM: '/zoomed_in_stained_glass_mural.jpg',
  
  // Church exterior placeholder
  BUILDING_EXTERIOR: '/ourChurchBuildingAndFlags.jpg',
  
  // Generated logo placeholder. Replace this with '/logo.png' after uploading your actual file.
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