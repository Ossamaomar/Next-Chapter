"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function InstructorHeader({
  name,
  title,
}: {
  name: string;
  title: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(container.current.children, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.3,
    });
  });
  return (
    <div ref={container} className="bg-emerald-500/30 py-12 px-8">
      <h3 className="text-lg">INSTRUCTOR</h3>
      <h2 className="text-3xl font-semibold">{name}</h2>
      <h4>{title}</h4>
    </div>
  );
}
