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

// --- SLUG GENERATION ---
const generateUniqueSlug = async (title: string, currentId?: string): Promise<string> => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)+/g, '');   // Remove leading/trailing hyphens

  // Check for any slugs that start with this baseSlug
  const { data } = await supabase
    .from('posts')
    .select('slug, id')
    .ilike('slug', `${baseSlug}%`);

  if (!data || data.length === 0) return baseSlug;

  // Filter out the current post if we are updating
  const existingSlugs = data
    .filter(p => p.id !== currentId && p.slug)
    .map(p => p.slug);

  if (!existingSlugs.includes(baseSlug)) return baseSlug;

  let counter = 1;
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }
  
  return `${baseSlug}-${counter}`;
};

export const getPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];

  return (data || []).map((post: any) => ({
    id: post.id,
    slug: post.slug,
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
    slug: data.slug,
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

export const getPostBySlugOrId = async (slugOrId: string): Promise<BlogPost | undefined> => {
  // Check if it looks like a UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

  let query = supabase.from('posts').select('*');
  
  if (isUuid) {
    // If it's a UUID, try finding by ID first
    const { data } = await query.eq('id', slugOrId).maybeSingle();
    if (data) return mapPostData(data);
    // If not found by ID, fall through to try slug (extremely unlikely collision)
  }
  
  // Try finding by Slug
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slugOrId).maybeSingle();
  
  if (error || !data) return undefined;
  return mapPostData(data);
};

const mapPostData = (data: any): BlogPost => ({
  id: data.id,
  slug: data.slug,
  title: data.title,
  content: data.content,
  imageUrl: data.image_url,
  videoUrl: data.video_url,
  authorId: data.author_id,
  authorName: data.author_name,
  createdAt: data.created_at,
  updatedAt: data.updated_at
});

export const createPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  const slug = await generateUniqueSlug(post.title);
  
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      title: post.title,
      slug: slug,
      content: post.content,
      image_url: post.imageUrl, 
      video_url: post.videoUrl,
      author_id: post.authorId,
      author_name: post.authorName
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  return mapPostData(data);
};

export const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
  const updateData: any = {
      title: updates.title,
      content: updates.content,
      image_url: updates.imageUrl,
      video_url: updates.videoUrl,
      updated_at: new Date().toISOString()
  };

  // If title changed, update slug
  if (updates.title) {
    updateData.slug = await generateUniqueSlug(updates.title, id);
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  return mapPostData(data);
};

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
