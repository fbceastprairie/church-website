import { supabase } from './supabase';
import { BlogPost, UserRole } from "../types";

// INITIALIZATION
// Supabase is persistent, so we don't need to seed it on every load like localStorage.
// We keep this function to satisfy imports in other files.
export const initializeDatabase = () => {
  // No-op for Supabase
};

// --- USER OPERATIONS ---

export const getUsers = async (): Promise<any[]> => {
  // In Supabase, you typically don't list all users from the client side for security.
  // We'll return an empty array or you could implement a 'profiles' table fetch here.
  return [];
};

export const addUser = async (username: string, password: string, role: UserRole): Promise<void> => {
  // Creating users usually requires the Service Role key or using the Invite API.
  // For safety, we throw an error instructing the admin to use the Supabase Dashboard.
  throw new Error("To add new users, please use the 'Authentication' tab in your Supabase Dashboard.");
};

// --- BLOG OPERATIONS ---

export const getPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error loading posts:', error);
    return [];
  }

  // Map database columns to our TypeScript interface if casing differs,
  // otherwise cast data. Assuming table columns match interface (camelCase or snake_case mapping needed if not).
  // If your Supabase columns are snake_case (created_at), we map them here.
  return (data || []).map((post: any) => ({
    ...post,
    // Ensure fallback for differences in naming conventions if you used defaults
    createdAt: post.created_at || post.createdAt,
    updatedAt: post.updated_at || post.updatedAt,
    authorId: post.author_id || post.authorId,
    authorName: post.author_name || post.authorName,
    videoUrl: post.video_url || post.videoUrl,
    imageUrl: post.image_url || post.imageUrl
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
    ...data,
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt,
    authorId: data.author_id || data.authorId,
    authorName: data.author_name || data.authorName,
    videoUrl: data.video_url || data.videoUrl,
    imageUrl: data.image_url || data.imageUrl
  };
};

export const createPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  const newPost = {
    title: post.title,
    content: post.content,
    image_url: post.imageUrl, // Mapping to snake_case for standard SQL convention
    video_url: post.videoUrl,
    author_id: post.authorId,
    author_name: post.authorName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('posts')
    .insert([newPost])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    ...data,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    authorId: data.author_id,
    authorName: data.author_name,
    videoUrl: data.video_url,
    imageUrl: data.image_url
  };
};

export const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
  // Map updates to snake_case
  const dbUpdates: any = {};
  if (updates.title) dbUpdates.title = updates.title;
  if (updates.content) dbUpdates.content = updates.content;
  if (updates.imageUrl) dbUpdates.image_url = updates.imageUrl;
  if (updates.videoUrl) dbUpdates.video_url = updates.videoUrl;
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('posts')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    ...data,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    authorId: data.author_id,
    authorName: data.author_name,
    videoUrl: data.video_url,
    imageUrl: data.image_url
  };
};

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};