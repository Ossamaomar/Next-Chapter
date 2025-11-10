"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function CoursesHeader({ category }: { category: string }) {
  useGSAP(() => {
    gsap.from(".header-animation", {
      x: -100,
      opacity: 0,
      duration: 1,
    });
  });

  return (
    <h2 className="header-animation text-3xl font-medium">
      {category} Courses
    </h2>
  );
}
