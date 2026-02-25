-- Supabase: Create signups table for ChartHustlez launch waitlist
CREATE TABLE IF NOT EXISTS public.signups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_signups_email ON public.signups(email);
CREATE INDEX IF NOT EXISTS idx_signups_created_at ON public.signups(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (signup form)
CREATE POLICY "Allow anonymous inserts" ON public.signups
  FOR INSERT TO anon WITH CHECK (true);

-- Allow service_role to read all (insights API)
CREATE POLICY "Allow service role read" ON public.signups
  FOR SELECT TO service_role USING (true);
