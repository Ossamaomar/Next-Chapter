import { createClient } from "@supabase/supabase-js";

export type UserRole = "Student" | "Instructor";

export type AppUser = {
  id: string;
  email: string | null;
  role: UserRole;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// export const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL as string,
//   process.env.SUPABASE_SERVICE_ROLE_KEY as string // This key must be kept secure!
// );
