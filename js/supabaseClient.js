import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://xaplplzqxhyjjcebhtvz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcGxwbHpxeGh5ampjZWJodHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMjExNjAsImV4cCI6MjA4NDY5NzE2MH0.T5SNqohHrSPZiMLPt_b2RzFZdGiGxTqddHiWKG1aIEk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
