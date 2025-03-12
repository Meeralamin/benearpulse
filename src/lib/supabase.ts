import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://pahbrjjdhumqcpmnqyxw.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaGJyampkaHVtcWNwbW5xeXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3Njk2NTMsImV4cCI6MjA1NzM0NTY1M30.MDJN8CdNNueoOcgVTin0ay6u0rwcjrDRrpsTcJlRyQc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
