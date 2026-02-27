// Supabase Configuration
// These environment variables are automatically injected by Vercel
const SUPABASE_URL = 'https://jxgfjhvlfflkijebqrpz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Z2ZqaHZsZmZsa2lqZWJxcnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjM3NzUsImV4cCI6MjA1NTM5OTc3NX0.t0lL8sPjDdNB_LLbmx1H-AQO58N9wZNP_Y1JfLhH27M';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
