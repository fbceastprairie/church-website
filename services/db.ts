import { createClient } from '@supabase/supabase-js';
import { BlogPost, UserRole } from "../types";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "../constants";

// Initialize the Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// --- INITIALIZATION ---
// Supabase handles the database structure, so we don't need to seed local storage anymore.
export const initializeDatabase = () => {
  // No-op for Supabase, but keeping function to avoid breaking existing calls in App.tsx
  console.log("App initialized with Supabase.");
};

// --- USER OPERATIONS ---

// In Supabase, we create users via the Auth API (signup).
// This function adds the "Profile" entry to the database to store the Role.
export const addUser = async (username: string, password: string, role: UserRole): Promise<void> => {
  // 1. Create the Auth User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: `${username}@fbceastprairie.org`, // Dummy email generation for username-based login
    password: password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Failed to create user");

  // 2. Create the Public Profile with Role
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      { id: authData.user.id, username: username, role: role }
    ]);

  if (profileError) {
    // Cleanup if profile creation fails
    console.error("Profile creation failed", profileError);
    throw new Error("Failed to create user profile");
  }
};

// --- BLOG OPERATIONS ---

export const getPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  // Map Supabase snake_case to our CamelCase TypeScript types
  return data.map((post: any) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.image_url,
    videoUrl: post.video_url,
    authorId: post.author_id,
    authorName: post.author_name,
    createdAt: new Date(post.created_at).getTime(),
    updatedAt: new Date(post.updated_at).getTime()
  }));
};

export const getPostById = async (id: string): Promise<BlogPost | undefined> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    imageUrl: data.image_url,
    videoUrl: data.video_url,
    authorId: data.author_id,
    authorName: data.author_name,
    createdAt: new Date(data.created_at).getTime(),
    updatedAt: new Date(data.updated_at).getTime()
  };
};

export const createPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      title: post.title,
      content: post.content,
      image_url: post.imageUrl,
      video_url: post.videoUrl,
      author_id: post.authorId,
      author_name: post.authorName
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    imageUrl: data.image_url,
    videoUrl: data.video_url,
    authorId: data.author_id,
    authorName: data.author_name,
    createdAt: new Date(data.created_at).getTime(),
    updatedAt: new Date(data.updated_at).getTime()
  };
};

export const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
  const dbUpdates: any = {};
  if (updates.title) dbUpdates.title = updates.title;
  if (updates.content) dbUpdates.content = updates.content;
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
  if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('posts')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    imageUrl: data.image_url,
    videoUrl: data.video_url,
    authorId: data.author_id,
    authorName: data.author_name,
    createdAt: new Date(data.created_at).getTime(),
    updatedAt: new Date(data.updated_at).getTime()
  };
};

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};