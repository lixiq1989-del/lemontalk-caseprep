import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uklhrnkilqkvklfowgfz.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrbGhybmtpbHFrdmtsZm93Z2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDExMjEsImV4cCI6MjA4OTg3NzEyMX0.BkyQ8ROXLz3PUq13BA_vmRMR40MejF_t3fDMSeQoDWY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
