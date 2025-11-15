import { supabase } from "@/app/_lib/supabase";
import {
  Course,
  CourseEditType,
  CourseLecture,
  CourseResponse,
  CourseSection,
  Rating,
  User,
} from "./types";

export async function createCourse(course: Course, user: User) {
  // const fileId = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${
  //   course.image.name
  // }`;

  // // 1. Upload the thumbnail to the supabase storage
  // // Upload to Supabase
  // const { error: storageError } = await supabase.storage
  //   .from("courses-thumbnails")
  //   .upload(fileId, course.image);

  // if (storageError) {
  //   console.error("Upload error:", storageError.message);
  //   throw new Error(`Upload error: ${storageError}`);
  // }

  // // Get thumbnail URL
  // const { data: thumbnailUrl } = supabase.storage
  //   .from("courses-thumbnails")
  //   .getPublicUrl(fileId);

  // 2. Add course to the database
  const { data, error } = await supabase
    .from("courses")
    .insert({
      title: course.title,
      description: course.description,
      price: course.price,
      instructor_id: user.id,
      thumbnail_url: course.thumbnail_url,
      instructor_name: user.name,
      category: course.category,
    })
    .select();

  if (error) {
    console.error("Add course error:", error.message);
    throw new Error(`Upload error: ${error.message}`);
  } else {
    return data;
  }
}

export async function editCourseById(course: CourseEditType, id: string) {
  // 2. Edit the course in the database
  const { data, error } = await supabase
    .from("courses")
    .update({
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail_url: course.thumbnail_url,
    }) // fields to update
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Add course error:", error.message);
    return false;
  } else {
    return data;
  }
}

export async function deleteCourseById(
  id: string,
  sections: CourseSection[],
  lectures: CourseLecture[]
) {
  for (let i = 0; i < lectures.length; i++) {
    const { error } = await supabase
      .from("lectures")
      .delete()
      .eq("id", lectures[i].id);

    if (error) {
      throw new Error(error.message);
    }
  }

  for (let i = 0; i < sections.length; i++) {
    const { error } = await supabase
      .from("sections")
      .delete()
      .eq("id", sections[i].id);

    if (error) {
      throw new Error(error.message);
    }
  }

  const { error: cartError } = await supabase
    .from("cartItems")
    .delete()
    .eq("courseId", id);

  if (cartError) {
    throw new Error(cartError.message);
  }

  const { error: wishlistError } = await supabase
    .from("wishlistItems")
    .delete()
    .eq("courseId", id);

  if (wishlistError) {
    throw new Error(wishlistError.message);
  }

  const { error: enrollmentsError } = await supabase
    .from("enrollments")
    .delete()
    .eq("courseId", id);

  if (enrollmentsError) {
    throw new Error(enrollmentsError.message);
  }

  const { error: progressError } = await supabase
    .from("lectures_progress")
    .delete()
    .eq("courseId", id);

  if (progressError) {
    throw new Error(progressError.message);
  }

  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  } else {
    return true;
  }
}

export async function getCourseById(id: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("An error fetching a course:", error.message);
    return false;
  } else {
    return data;
  }
}

export async function getCoursesByCategoryName(category: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("category", category);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAllCoursesForInstructor(id: string) {
  // console.log(id)
  const { data, error } = await supabase
    .from("courses")
    .select()
    .eq("instructor_id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function uploadThumbnail(img: File) {
  const fileId = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${
    img.name
  }`;

  // 1. Upload the thumbnail to the supabase storage
  // Upload to Supabase
  const { error: storageError } = await supabase.storage
    .from("courses-thumbnails")
    .upload(fileId, img);

  if (storageError) {
    console.error("Upload error:", storageError.message);
    return false;
  }

  // Get thumbnail URL
  const { data: thumbnailUrl } = supabase.storage
    .from("courses-thumbnails")
    .getPublicUrl(fileId);

  return thumbnailUrl.publicUrl;
}

export async function searchCourse(query: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .ilike("title", `%${query}%`);

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}

export async function updateCourseDuration(
  id: string,
  duration: number,
  type: "inc" | "dec"
) {
  const { error: incError } = await supabase.rpc("update_course_duration", {
    course_id: id,
    amount: type === "inc" ? duration : -duration,
  });

  if (incError) {
    throw new Error(incError.message);
  }
}

export async function updateCourseNumberOfLectures(
  id: string,
  type: "inc" | "dec"
) {
  const { error: incError } = await supabase.rpc(
    "update_course_number_of_lectures",
    {
      course_id: id,
      amount: type === "inc" ? 1 : -1,
    }
  );

  if (incError) {
    throw new Error(incError.message);
  }
}

export async function addCourseRating(
  course: CourseResponse,
  newRating: number
) {
  const newAvg =
    (course.avgRating * course.numberOfRatings + newRating) /
    (course.numberOfRatings + 1);

  const { data, error } = await supabase
    .from("courses")
    .update({
      avgRating: newAvg,
      numberOfRatings: course.numberOfRatings + 1,
    })
    .eq("id", course.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function editCourseRating(
  course: CourseResponse,
  newRating: number,
  rating: Rating
) {
  const { data: previousRating, error: previousError } = await supabase
    .from("ratings")
    .select("*")
    .eq("id", rating.id)
    .maybeSingle();

  if (previousError) {
    throw new Error(previousError.message);
  }


  const newAvg =
    (course.avgRating * course.numberOfRatings +
      newRating -
      previousRating.rating) /
    course.numberOfRatings;

  const { data, error } = await supabase
    .from("courses")
    .update({
      avgRating: newAvg,
    })
    .eq("id", course.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
