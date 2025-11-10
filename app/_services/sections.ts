import { supabase } from "../_lib/supabase";
import { updateCourseDuration } from "./courses";
import { CourseLecture, CourseSectionInputs } from "./types";

export async function getCourseSections(id: string) {
  const { data, error } = await supabase
    .from("sections")
    .select()
    .eq("course_id", id);

  if (error) {
    console.error(error.message);
    return [];
  } else {
    // console.log(data)
    return data;
  }
}

export async function addSection(section: CourseSectionInputs) {
  const { data, error } = await supabase
    .from("sections")
    .insert(section)
    .select()
    .maybeSingle();

  if (error) {
    console.error(error.message);
    return null;
  } else {
    return data;
  }
}

export async function deleteSection(
  id: string,
  sections: { id: string; order_index: number }[],
  sectionLectures: CourseLecture[]
) {
  for (let i = 0; i < sectionLectures.length; i++) {
    await updateCourseDuration(sectionLectures[i].course_id, sectionLectures[i].duration, "dec")
    const { error } = await supabase.from("lectures").delete().eq("id", sectionLectures[i].id);

    if (error) {
      throw new Error(error.message);
    } 
  }

  const { error } = await supabase.from("sections").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  } else {
    return await updateSectionsOrder(sections);
  }
}

export async function editSection(id: string, name: string) {
  const { data, error } = await supabase
    .from("sections")
    .update({
      name: name,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error(error.message);
    return false;
  } else {
    console.log(data);
    return data;
  }
}

export async function updateSectionsOrder(
  sections: { id: string; order_index: number }[]
) {
  const { data, error } = await supabase
    .from("sections")
    .upsert(sections, { onConflict: "id" });

  if (error) {
    console.error("Failed to update order", error.message);
    throw error;
  }

  return data;
}
