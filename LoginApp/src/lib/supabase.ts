import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gtsfajcqjwiwiqgdukfx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0c2ZhamNxandpd2lxZ2R1a2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNjQwNzEsImV4cCI6MjA5MTg0MDA3MX0.abPDhy73wm33ltu2pE-WnygLJlNPDRoYUH8kAFRcqKM';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);