// src/config/supabase.js
// ─────────────────────────────────────────────────────────────────────────────
// Creates and exports a single Supabase client instance.
// We use the SERVICE KEY (not anon key) so we can bypass Row Level Security
// and perform admin operations (insert, update, delete freely).
// NEVER expose this key to the frontend!
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default supabase;
