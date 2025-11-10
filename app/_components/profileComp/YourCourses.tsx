"use client";

import CoursesRow from "./CoursesRow";
import CourseCard from "./CourseCard";
import { CourseResponse } from "@/app/_services/types";


export default function YourCourses({
  courses,
}: {
  courses: CourseResponse[];
}) {
  return (
    <div className="py-10">
      <h1 className="text-2xl font-medium mb-5">Your Courses</h1>
      <CoursesRow>
        {courses.map((course: CourseResponse) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </CoursesRow>
    </div>
  );
}
