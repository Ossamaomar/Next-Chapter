"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function CoursesRow({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Set initial hidden states
    gsap.set(headingRef.current, {
      x: -100,
      opacity: 0,
    });

    gsap.set(cardsRef.current.children, {
      y: 50,
      opacity: 0,
    });

    // Animate to visible states
    gsap.to(headingRef.current, {
      x: 0,
      opacity: 1,
      duration: 1,
      delay: 0.3,
    });

    gsap.to(cardsRef.current.children, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      delay: 0.6,
      stagger: {
        each: 0.3,
      },
    });
  });

  return (
    <div>
      <div ref={headingRef} className="space-y-1 mb-6">
        <h4 className="text-xl font-medium">Courses to get you started</h4>
        <p className="text-gray-600 font-light">
          Explore courses from experienced, real-world experts.
        </p>
      </div>
      <div
        ref={cardsRef}
        className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1"
      >
        {children}
      </div>
    </div>
  );
}