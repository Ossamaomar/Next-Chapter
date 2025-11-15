"use client";

import { searchCourse } from "@/app/_services/courses";
import { CourseResponse } from "@/app/_services/types";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "sonner";

export default function Searchbar({
  setCourses,
  setShowResults,
}: {
  setCourses: Dispatch<SetStateAction<CourseResponse[]>>;
  setShowResults: Dispatch<SetStateAction<boolean>>;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  async function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.length < 2) {
      setCourses([]);
      return;
    }
    try {
      const data = await searchCourse(query);
      setCourses(data);
    } catch {
      toast.error("Error occured while searching");
    }
  }

  function handleEnterPressed(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", searchQuery);
      router.push(`/courses/?${params.toString()}`);
      setShowResults(false);
      searchRef.current.blur()
    }
  }

  return (
    <div className="w-full flex items-center relative">
      <IoSearchOutline className="absolute left-3" size={18} />
      <input
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setShowResults(true)}
        onKeyDown={handleEnterPressed}
        ref={searchRef}
        type="text"
        className="w-full border-2 border-gray-300 outline-0 focus:border-emerald-600 rounded-2xl py-2 px-10"
        placeholder="Search for courses"
      />
    </div>
  );
}
