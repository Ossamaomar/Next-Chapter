import { supabase } from "../_lib/supabase";
import { updateCourseDuration, updateCourseNumberOfLectures } from "./courses";
import { CourseLecture, CourseLectureInput } from "./types";

export async function getLecturesByCourse(courseId: string) {
  const { data, error } = await supabase
    .from("lectures")
    .select()
    .eq("course_id", courseId);

  if (error) {
    console.error(error.message);
    return [];
  } else {
    return data;
  }
}

export async function getLecturesBySection(sectionId: string) {
  const { data, error } = await supabase
    .from("lectures")
    .select()
    .eq("section_id", sectionId);

  if (error) {
    console.error(error.message);
    return [];
  } else {
    return data;
  }
}

export async function createLecture(lecture: CourseLectureInput) {
  await updateCourseDuration(lecture.course_id, lecture.duration, "inc");
  await updateCourseNumberOfLectures(lecture.course_id, "inc");

  // 2. Add course to the database
  const { data, error } = await supabase
    .from("lectures")
    .insert({
      title: lecture.title,
      description: lecture.description ?? "",
      course_id: lecture.course_id,
      section_id: lecture.section_id,
      video_url: lecture.video,
      duration: lecture.duration,
      order_index: lecture.order_index,
      section_index: lecture.section_index,
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Add lecture error: ${error.message}`);
  } else {
    return data;
  }
}

export async function editLectureApi(lecture: CourseLectureInput, id: string) {
  // 2. Add course to the database
  const { data, error } = await supabase
    .from("lectures")
    .update({
      title: lecture.title,
      description: lecture.description ?? "",
      course_id: lecture.course_id,
      section_id: lecture.section_id,
      video_url: lecture.video,
      duration: lecture.duration,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Add lecture error: ${error.message}`);
  } else {
    return data;
  }
}

export async function deleteLectureApi(lecture: CourseLecture) {
  await updateCourseDuration(lecture.course_id, lecture.duration, "dec");
  await updateCourseNumberOfLectures(lecture.course_id, "dec");

  const { error } = await supabase
    .from("lectures")
    .delete()
    .eq("id", lecture.id);
  if (error) {
    throw new Error(`Delete lecture error: ${error.message}`);
  } else {
    return true;
  }
}

export async function getLecturesProgress(enrollmentId: string) {
  const { data, error } = await supabase
    .from("lectures_progress")
    .select("*")
    .eq("enrollmentId", enrollmentId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
