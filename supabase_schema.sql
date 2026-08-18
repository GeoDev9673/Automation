-- =========================================================
-- PARALIFE - Supabase Database Setup for Email Subscribers
-- =========================================================

-- 1. Create the subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL
);

-- 2. Create unique case-insensitive index on email
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_idx ON public.subscribers (lower(email));

-- 3. Disable RLS or grant public permissions for subscriber lookup & collection
ALTER TABLE public.subscribers DISABLE ROW LEVEL SECURITY;

-- 4. Grant schema and table SELECT & INSERT permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, public;
GRANT ALL ON TABLE public.subscribers TO anon, authenticated, public;
