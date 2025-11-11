"use client";

import { getEnrollmentsState } from "@/store/enrollmentsSlice";
import { useSelector } from "react-redux";
import CourseLearnCard from "./CourseLearnCard";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function MyLearningCoursesRow() {
  const enrollments = useSelector(getEnrollmentsState);
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(
      container.current,
      { filter: "blur(10px)", opacity: 0 },
      {
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.5,
        delay: 1,
        ease: "power2.out",
      }
    );
  });
  return (
    <div ref={container} className="mx-auto sm:w-[500px] md:w-[700px] lg:w-[1000px] xl:w-[1200px] space-y-4">
      <h2 className="text-2xl font-semibold">My Courses</h2>
      <div className="w-full grid gap-4 xl:grid-cols-4 lg:grid-cols-3  sm:grid-cols-2 grid-cols-1">
        {enrollments?.enrollments?.map((enr) => (
          <CourseLearnCard key={enr.id} enrollment={enr} />
        ))}
      </div>
    </div>
  );
}
