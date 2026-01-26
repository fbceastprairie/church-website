

import { createClient } from '@supabase/supabase-js';
import { supabase, supabaseUrl, supabaseAnonKey } from './supabase.ts';
import { BlogPost, UserRole } from "../types.ts";

export const initializeDatabase = () => {};

export const getUsers = async (): Promise<any[]> => {
  const { data, error } = await supabase.rpc('get_users');
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data || [];
};

export const addUser = async (email: string, password: string, role: UserRole): Promise<void> => {
  /* Fixed: Use V2 style options nested under 'auth' */
  const tempClient = createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  );

  /* Fixed: Use V2 style signUp with a single configuration object and handle 'data' response */
  const { data, error: signUpError } = await tempClient.auth.signUp({
    email,
    password,
    options: {
      data: { role }
    }
  });

  const user = data?.user;

  if (signUpError) throw new Error(signUpError.message);
  if (!user) throw new Error("User creation failed.");

  const { error: rpcError } = await supabase.rpc('approve_new_user', {
    target_user_id: user.id,
    target_role: role
  });

  if (rpcError) throw new Error(rpcError.message);
};

export const deleteUser = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc('delete_user', { target_user_id: userId });
  if (error) throw new Error(error.message);
};

export const updateUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
  const { error } = await supabase.rpc('update_user_role', { target_user_id: userId, new_role: newRole });
  if (error) throw new Error(error.message);
};

export const getPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];

  return (data || []).map((post: any) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.image_url,
    videoUrl: post.video_url,
    authorId: post.author_id,
    authorName: post.author_name,
    createdAt: post.created_at,
    updatedAt: post.updated_at
  }));
};

export const getPostById = async (id: string): Promise<BlogPost | undefined> => {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
  if (error || !data) return undefined;

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    imageUrl: data.image_url,
    videoUrl: data.video_url,
    authorId: data.author_id,
    authorName: data.author_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const createPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  /* Fixed: Corrected property mapping from camelCase authorName to snake_case author_name */
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

  if (error) throw new Error(error.message);
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    imageUrl: data.image_url,
    videoUrl: data.video_url,
    authorId: data.author_id,
    authorName: data.author_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('posts')
    .update({
      title: updates.title,
      content: updates.content,
      image_url: updates.imageUrl,
      video_url: updates.videoUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    imageUrl: data.image_url,
    videoUrl: data.video_url,
    authorId: data.author_id,
    authorName: data.author_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
};