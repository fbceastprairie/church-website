export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  // Password is omitted from the frontend object for safety, 
  // though in this mock DB it's stored in localstorage
}

export interface BlogPost {
  id: string;
  title: string;
  content: string; // Supports basic text and newlines
  imageUrl?: string;
  videoUrl?: string; // YouTube embed URL
  authorId: string;
  authorName: string;
  createdAt: number;
  updatedAt: number;
}

export interface ServiceTime {
  day: string;
  time: string;
  label: string;
}

export interface SetupStatus {
  isInitialized: boolean;
}