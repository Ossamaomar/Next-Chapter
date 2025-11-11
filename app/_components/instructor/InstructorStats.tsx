"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function InstructorStats({
  students,
  ratings,
}: {
  students: number;
  ratings: number;
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
    <div ref={container} className="flex gap-6 lg:mt-10">
      <div>
        <p className="font-semibold">{students}</p>
        <p className="text-sm text-gray-500">Total learners</p>
      </div>
      <div>
        <p className="font-semibold">{ratings}</p>
        <p className="text-sm text-gray-500">Review</p>
      </div>
    </div>
  );
}
