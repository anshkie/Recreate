// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your own Supabase project details
const supabaseUrl = 'https://vkprcaeidcenvkcmsxzt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcHJjYWVpZGNlbnZrY21zeHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNzM4NjMsImV4cCI6MjA2Mzk0OTg2M30.z0gCqkyfaTZzZkLa0jH1r3-Ijb1ogYX3L_BWVxwCaRw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
