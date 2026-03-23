import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uklhrnkilqkvklfowgfz.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrbGhybmtpbHFrdmtsZm93Z2Z6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMwMTEyMSwiZXhwIjoyMDg5ODc3MTIxfQ.yG4S8woCsFKsbJiyAojNCo6r_eeEhOsflcVJT7s3XTw";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
