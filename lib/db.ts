import { createClient } from "@supabase/supabase-js";

// Public client (uses anon key - respects RLS policies)
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Admin client (uses service_role key - bypasses RLS for insights)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
