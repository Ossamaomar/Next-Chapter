"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function EmptyCourses({ category }: { category: string }) {
  useGSAP(() => {
    gsap.from(".anim", {
      opacity: 0,
      x: -100,
      duration: 1,
      delay: 0.5
    });
  });

  return (
    <div className="anim">
      <h2 className="text-xl ">
        There are no courses added yet for the{" "}
        <span className="font-bold">{category}</span> category.
      </h2>
    </div>
  );
}
