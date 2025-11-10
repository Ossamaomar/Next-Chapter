import { supabase } from "@/app/_lib/supabase";
import { InstructorInfo, userSignin, userSignup } from "./types";
import { toast } from "sonner";
import { createClient } from "../_lib/server";


export async function signUp(params: userSignup) {
  const { email, name, password, role, gender } = params;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (authError) {
    console.error(authError);
    toast.error("An error occured during sign up");
    throw new Error("An error occured during signup");
  }

  const user = authData.user;

  // Step 2: Add to custom `users` table
  const { error: dbError } = await supabase.from("users").insert({
    id: user?.id,
    email: user?.email,
    name,
    role,
    gender,
  });

  if (dbError) {
    if (dbError.code) {
      toast.error("This account already exists");
    }
    throw new Error("An error occured during signup");
  }

  return authData;
}

export async function login(params: userSignin) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });

  if (error) {
    console.log(error);
    throw new Error("An error occured during sign in");
  }

  return data;
}

export async function logout() {
  console.log("I am here logout");
  try {
    await supabase.auth.signOut();
    await fetch("/api/auth/clear-cookies", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error(error);
    throw new Error("An error occured during logout");
  }
}

export async function deleteUserByEmail(email: string) {
  const { error } = await supabase.from("users").delete().eq("email", email);

  if (error) {
    console.error("Error deleting user:", error.message);
    return { success: false, error };
  }

  return { success: true };
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle(); // gets one row only

  if (error) {
    console.log("Error fetching user:", error.message);
    return null;
  }

  return data;
}

export async function getUserById(userId: string | undefined) {
  if (!userId) return null;

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function updateUserVerficationByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ isVerified: true }) // Only update the `role` field
    .eq("email", email)
    .select()
    .maybeSingle(); // Return the updated row

  if (error) {
    console.error("Failed to update role:", error.message);
    return null;
  }

  return data;
}

// Function to check authentication via Next.js API
export async function checkAuthFromNextJS() {
  try {
    const response = await fetch("/api/auth/check-token", {
      method: "GET",
      credentials: "include", // Important: include cookies
    });

    if (!response.ok) {
      throw new Error("Failed to check authentication");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Auth check error:", error);
    return { authenticated: false, user: null };
  }
}

export async function checkAuthFromServerNextJS() {
  try {
    const response = await fetch("/api/auth/check-token-server", {
      method: "GET",
      credentials: "include", // Important: include cookies
    });

    if (!response.ok) {
      throw new Error("Failed to check authentication");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Auth check error:", error);
    return { authenticated: false, user: null };
  }
}

export async function getInstructorInfo(id: string) {
  const { data, error } = await supabase
    .from("instructors")
    .select()
    .eq("id", id).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createInstructorInfo(info: InstructorInfo) {
  const { data, error } = await supabase.from("instructors").insert({
    id: info.id,
    name: info.name,
    title: info.title,
    description: info.description,
    personalPictureUrl: info.personalPictureUrl,
    links: info.links,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getUserSession() {
  const { data: authData, error: authError } = await supabase.auth.getSession();

  if (authError) {
    throw new Error(authError.message);
  }
  console.log(authData)

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authData?.session?.user?.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
// export async function fetchAuthUserByEmail(email: string) {
//   const { data, error } = await supabaseAdmin.auth.admin.getUserByEmail(email);

//   if (error) {
//     console.error("Error fetching auth user:", error.message);
//     return null;
//   }

//   return data.user;
// }
