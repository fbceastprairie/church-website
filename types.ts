export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string; // Supports basic text and newlines
  imageUrl?: string | null;
  videoUrl?: string | null; // YouTube embed URL
  authorId: string;
  authorName: string;
  createdAt: string; // Changed to string for ISO dates from Supabase
  updatedAt: string; // Changed to string for ISO dates from Supabase
}

export interface ServiceTime {
  day: string;
  time: string;
  label: string;
}

export interface SetupStatus {
  isInitialized: boolean;
}