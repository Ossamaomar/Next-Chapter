import { supabase } from "../_lib/supabase";

export async function getCoursesCategories() {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
