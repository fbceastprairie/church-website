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
-- We drop existing policies first to prevent "policy already exists" errors when re-running.

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
-- These allow the website Admin Dashboard to list and create users securely.

-- Function to GET all users (id, email, role, created_at)
CREATE OR REPLACE FUNCTION get_users()
RETURNS TABLE (
  id uuid,
  email varchar,
  role text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with the privileges of the creator (Admin)
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

-- Clean up old functions to avoid confusion
DROP FUNCTION IF EXISTS create_user(text, text, text);
DROP FUNCTION IF EXISTS create_new_user(text, text, text);

-- Function to CREATE a new user
-- Renamed to 'create_new_user' to avoid schema cache conflicts
CREATE OR REPLACE FUNCTION create_new_user(
  user_email text,
  user_password text,
  user_role text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if user already exists to avoid hard SQL error
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    RAISE EXCEPTION 'User with email % already exists', user_email;
  END IF;

  -- Create the user in the auth system
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')), -- Hash the password securely
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('role', user_role, 'username', split_part(user_email, '@', 1)),
    now(),
    now(),
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Create identity (Required for login)
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    format('{"sub":"%s","email":"%s"}', new_user_id, user_email)::jsonb,
    'email',
    now(),
    now(),
    now()
  );

  RETURN new_user_id;
END;
$$;

-- Force schema cache reload (Supabase specific helper)
NOTIFY pgrst, 'reload config';