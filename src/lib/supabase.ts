import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fohhwnntwkhvbnliojby.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaGh3bm50d2todmJubGlvamJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTg0NDUsImV4cCI6MjA5MTMzNDQ0NX0.pwxoDxxezCoaM2bjbE5NWd1yoM3mGTJZJjP1Bae-yyI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
