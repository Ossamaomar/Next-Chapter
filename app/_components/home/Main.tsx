"use client";

import { merriweather } from "@/app/_lib/fonts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useRef } from "react";
import Book from "../ui/book/Book";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BackgroundIcons from "./BackgroundIcons";

export default function Main() {
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(mainRef.current.children, {
      y: 0,
      duration: 1,
      opacity: 1,
      stagger: {
        grid: "auto",
        from: "start",
        each: 0.3,
      },
    });
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] relative md:min-h-[calc(100vh-5rem)]  px-8 py-4 flex flex-col md:flex-row justify-center items-center bg-gradient-to-r from-amber-50 to-emerald-100">
      <div
        ref={mainRef}
        className=" md:w-1/2 flex flex-col justify-center items-center gap-2 md:gap-5"
      >
        <div
          className="bg-emerald-500 text-white rounded-full px-3 py-1 w-fit text-md flex justify-between items-center gap-2"
          style={{ opacity: 0, transform: "translateY(200px)" }}
        >
          <div className="p-3 bg-amber-400 rounded-full">
            <Book />
          </div>
          <p className="">Learn from our experts</p>
        </div>
        <div
          className={`text-2xl md:text-3xl lg:text-5xl text-center ${merriweather.className} w-full`}
          style={{ opacity: 0, transform: "translateY(200px)" }}
        >
          Experience a learning platform that takes you to the{" "}
          <span className="text-emerald-500">NEXT</span> level
        </div>
        <div
          className="flex gap-2 items-center"
          style={{ opacity: 0, transform: "translateY(200px)" }}
        >
          <Button className="bg-amber-400 text-white border-2 border-amber-400 px-3 py-2 rounded-full transition duration-500 hover:bg-white hover:text-black">
            <Link href="/courses">Get started</Link>
          </Button>
          <Button
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }}
            className="border-2 cursor-pointer bg-transparent text-black border-emerald-500 px-3 py-2 rounded-full transition duration-500 hover:bg-white"
          >
            Learn more
          </Button>
        </div>
      </div>
      <BackgroundIcons />
    </div>
  );
}
