// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ⚠️ REPLACE THESE WITH YOUR KEYS FROM SUPABASE DASHBOARD -> SETTINGS -> API
const supabaseUrl = 'https://xskextoezvvgojyzcbxy.supabase.co';
const supabaseKey = 'sb_publishable_ZAgzlIUhT418scbMM2AQjQ_IfRDSetZ';

export const supabase = createClient(supabaseUrl, supabaseKey);