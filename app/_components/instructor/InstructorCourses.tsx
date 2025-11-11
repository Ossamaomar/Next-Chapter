"use client";

import { CourseResponse } from "@/app/_services/types";
import CourseCard from "../profileComp/CourseCard";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function InstructorCourses({
  courses,
}: {
  courses: CourseResponse[];
}) {
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
    <div ref={container} className="space-y-4">
      <h3 className="text-2xl font-bold">My Courses ({courses.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
