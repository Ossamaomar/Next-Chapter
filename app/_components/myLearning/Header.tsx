"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function Header() {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(container.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.3,
    });
  });
  return (
    <div ref={container} className="bg-emerald-500/30 py-12 px-8">
      <div className="w-full mx-auto sm:w-[500px] md:w-[700px] lg:w-[1000px] xl:w-[1200px]">
        <h2 className="text-3xl font-semibold">My Learning</h2>
      </div>
    </div>
  );
}
