import { supabase } from "../_lib/supabase";
import { Enrollment } from "./types";

export async function createRating(
  enrollment: Enrollment,
  rating: number,
  feedback: string = ""
) {
  const { data, error } = await supabase
    .from("ratings")
    .insert({
      enrollmentId: enrollment.id,
      courseId: enrollment.courseId,
      rating,
      feedback,
      instructorId: enrollment.instructorId,
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function editRating(
  enrollment: Enrollment,
  rating: number,
  feedback: string = ""
) {
  const { data, error } = await supabase
    .from("ratings")
    .update({
      rating,
      feedback,
    })
    .eq("enrollmentId", enrollment.id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getRating(enrollmentId: string) {
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("enrollmentId", enrollmentId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCourseTotalRating(courseId: string) {
  const { data, error } = await supabase
    .from("ratings")
    .select()
    .eq("courseId", courseId);

  if (error) {
    throw new Error(error.message);
  }

  const numberOfRatings = data.length;
  const avgRating = numberOfRatings
    ? data.reduce((acc, cur) => (acc += cur.rating), 0) / numberOfRatings
    : 0;

  return { avgRating, numberOfRatings };
}

export async function getNumOfRatingsForInstructor(instructorId: string) {
  const { data, error } = await supabase
    .from("ratings")
    .select()
    .eq("instructorId", instructorId);

  if (error) {
    throw new Error(error.message);
  }

  return data.length;
}
