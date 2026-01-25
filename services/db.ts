import { supabase } from './supabase';
import { BlogPost, UserRole } from "../types";

// INITIALIZATION
export const initializeDatabase = () => {
  // No-op for Supabase
};

// --- USER OPERATIONS ---

export const getUsers = async (): Promise<any[]> => {
  const { data, error } = await supabase.rpc('get_users');
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data || [];
};

export const addUser = async (email: string, password: string, role: UserRole): Promise<void> => {
  // We use a secure Remote Procedure Call (RPC) to create users on the server side
  // Params must match the names defined in the SQL function 'create_new_user'
  // We use 'create_new_user' instead of 'create_user' to ensure no caching conflicts occur.
  const { error } = await supabase.rpc('create_new_user', {
    user_email: email,
    user_password: password,
    user_role: role
  });

  if (error) {
    throw new Error(error.message); 
  }
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

  return (data || []).map((post: any) => ({
    ...post,
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
    image_url: post.imageUrl, 
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