"use client";

import { getEnrollmentsState } from "@/store/enrollmentsSlice";
import { useSelector } from "react-redux";
import CourseLearnCard from "./CourseLearnCard";

export default function MyLearningCoursesRow() {
  const enrollments = useSelector(getEnrollmentsState);
    
  return (
    <div className="mx-auto sm:w-[500px] md:w-[700px] lg:w-[1000px] xl:w-[1200px] space-y-4">
      <h2 className="text-2xl font-semibold">My Courses</h2>
      <div
        className="w-full grid gap-4 xl:grid-cols-4 lg:grid-cols-3  sm:grid-cols-2 grid-cols-1"
      >
        {enrollments?.enrollments?.map((enr) => (
          <CourseLearnCard key={enr.id} enrollment={enr} />
        ))}
      </div>
    </div>
  );
}
