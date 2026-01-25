-- Enable the pgcrypto extension (Required for password hashing)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create the Blog Posts Table (Safe if exists)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    author_id UUID NOT NULL,
    author_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) - Safe to run multiple times
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 3. Create Security Policies
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.posts;
CREATE POLICY "Public posts are viewable by everyone" 
ON public.posts FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts" 
ON public.posts FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update posts" ON public.posts;
CREATE POLICY "Authenticated users can update posts" 
ON public.posts FOR UPDATE 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete posts" ON public.posts;
CREATE POLICY "Authenticated users can delete posts" 
ON public.posts FOR DELETE 
USING (auth.role() = 'authenticated');


-- 4. TEAM MANAGEMENT FUNCTIONS (RPC)

-- Function to GET all users
CREATE OR REPLACE FUNCTION get_users()
RETURNS TABLE (
  id uuid,
  email varchar,
  role text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    au.id, 
    au.email::varchar, 
    (au.raw_user_meta_data->>'role')::text, 
    au.created_at
  FROM auth.users au
  ORDER BY au.created_at DESC;
END;
$$;

-- CLEANUP: Remove the old, fragile manual creation function
DROP FUNCTION IF EXISTS create_new_user(text, text, text);

-- NEW: Function to APPROVE a user created via the Client SDK
-- This sets their email to confirmed (skipping email verification) and sets their role.
CREATE OR REPLACE FUNCTION approve_new_user(
  target_user_id uuid,
  target_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET 
    email_confirmed_at = now(), -- Auto-confirm the user
    raw_user_meta_data = jsonb_set(
      coalesce(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      to_jsonb(target_role)
    )
  WHERE id = target_user_id;
END;
$$;

-- Function to DELETE a user
CREATE OR REPLACE FUNCTION delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- Function to UPDATE a user's role
CREATE OR REPLACE FUNCTION update_user_role(target_user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', to_jsonb(new_role))
  WHERE id = target_user_id;
END;
$$;

NOTIFY pgrst, 'reload config';