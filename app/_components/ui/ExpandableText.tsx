"use client";

import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { RiCollapseHorizontalFill } from "react-icons/ri";

export function ExpandableText({ text, wordLimit = 30 }) {
  const [expanded, setExpanded] = useState(false);

  if(!text) return
  // Split text into words
  const words = text?.trim().split(/\s+/);
  const isLong = words?.length > wordLimit;

  const displayedText = expanded ? text : words?.slice(0, wordLimit)?.join(" ");

  return (
    <div className="">
      <p
        className="text-sm text-gray-700 leading-relaxed italic inline "
        onClick={() => setExpanded((prev) => !prev)}
      >
        {displayedText}
      </p>
      {isLong && (
        <button
          className="cursor-pointer font-bold px-1 rounded-sm border border-slate-400 text-emerald-600 bg-gray-200 relative -bottom-1.5 ml-1"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? <RiCollapseHorizontalFill size={18} /> : <HiDotsHorizontal size={18}/>}
        </button>
      )}
    </div>
  );
}
