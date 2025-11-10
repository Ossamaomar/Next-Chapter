"use client";
import { merriweather } from "@/app/_lib/fonts";
import { DraggableCategories } from "./DraggableCategories";
import { Category } from "@/app/_services/types";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function CategoriesContainer({
  categories,
}: {
  categories: Category[];
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Then animate
      gsap.to(container.current.children, {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: "power2.inOut",
        stagger: {
          each: 0.2,
        },
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      <h2
        className={`text-center text-2xl md:text-3xl ${merriweather.className} mb-5`}
        style={{ opacity: 0, transform: "translateY(200px)" }}
      >
        Discover Our Courses Categories
      </h2>
      <div style={{ opacity: 0, transform: "translateY(200px)" }}>
        <DraggableCategories categories={categories} />
      </div>
    </div>
  );
}
