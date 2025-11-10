import { supabase } from "../_lib/supabase";
import { getLecturesByCourse } from "./lectures";
import { CourseLecture } from "./types";

export async function enrollCourse(
  courseId: string,
  studentId: string,
  instructorId: string,
  instructorName: string,
  courseTitle: string,
  courseThumbnail: string
) {
  const { data, error } = await supabase.from("enrollments").insert({
    courseId,
    studentId,
    instructorId,
    instructorName,
    courseTitle,
    courseThumbnail
  });

  if (error) {
    throw new Error("Error occurred during making enrollment");
  }

  return data;
}

export async function getEnrolledCourses(studentId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("studentId", studentId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getEnrollment(enrollmentId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function addLectureProgress(
  lecture: CourseLecture,
  enrollmentId: string,
  courseId: string,
  studentId: string
) {
  const { error } = await supabase.from("lectures_progress").insert({
    enrollmentId,
    lectureId: lecture.id,
    isCompleted: false,
    courseId,
    orderIndex: lecture.order_index,
    sectionIndex: lecture.section_index,
    studentId,
    duration: lecture.duration,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function checkLectureProgress(
  enrollmentId: string,
  lectureId: string,
  value: boolean
) {
  const { data, error } = await supabase
    .from("lectures_progress")
    .update({
      isCompleted: value,
    })
    .eq("enrollmentId", enrollmentId)
    .eq("lectureId", lectureId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createEnrollmentLecturesProgress(
  courseId: string,
  enrollmentId: string,
  studentId: string
) {
  const lectures: CourseLecture[] = await getLecturesByCourse(courseId);

  for (let i = 0; i < lectures.length; i++) {
    try {
      await addLectureProgress(lectures[i], enrollmentId, courseId, studentId);
    } catch {
      console.error("An error occurred during adding lectures to progress");
      break;
    }
  }
}

export async function getNumberOfEnrollmentsForInstructor(id: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("instructorId", id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getEnrollmentsForCourse(id: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("courseId", id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateEnrollmentProgress(id: string, progress: number) {
  const { data, error } = await supabase
    .from("enrollments")
    .update({ progress: progress })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
