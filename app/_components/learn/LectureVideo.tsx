"use client";

import { useState } from "react";
import { CourseLecture } from "@/app/_services/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScaleLoader } from "react-spinners";

export default function LectureVideo({
  lecture,
  isLoading,
  onNext,
  onPrev,
}: {
  lecture: CourseLecture;
  isLoading: boolean;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const [showControls, setShowControls] = useState(false);

  return (
    <div
      className="relative border-4 rounded-2xl  border-slate-300 overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative w-full aspect-video">
        {isLoading ? (
          <div className="absolute inset-0 bg-slate-800 flex justify-center items-center">
            <ScaleLoader color="#fff" />
          </div>
        ) : (
          <video
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            src={lecture?.video_url}
            controls
          ></video>
        )}
      </div>

      {/* Overlay buttons container */}
      <div
        className={`absolute inset-0 flex justify-between items-center transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: "none" }}
      >
        {/* Only the buttons capture clicks */}
        <button
          onClick={onPrev}
          className="ml-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition cursor-pointer"
          style={{ pointerEvents: "auto" }} // 👈 button re-enables pointer events
          disabled={isLoading}
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={onNext}
          className="mr-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition cursor-pointer"
          style={{ pointerEvents: "auto" }}
          disabled={isLoading}
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
