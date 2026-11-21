import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('SUPABASE_URL / SUPABASE_KEY belum diisi di file .env');
}

export const supabase = createClient(
  SUPABASE_URL || 'http://localhost',
  SUPABASE_KEY || 'missing-key'
);
