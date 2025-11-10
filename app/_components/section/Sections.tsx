"use client";

import { Accordion } from "@/components/ui/accordion";
import Section from "./Section";
import { CourseSection } from "@/app/_services/types";
import { useSelector } from "react-redux";
import { getCurrentWatchedLectureState } from "@/store/enrollmentsSlice";

export default function Sections({
  courseSections,
}: {
  courseSections: CourseSection[];
}) {
  const currentLecture = useSelector(getCurrentWatchedLectureState);
  return (
    <div className="w-full">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={currentLecture?.section_id}
      >
        {courseSections?.map((section) => (
          <Section key={section.id} section={section} />
        ))}
      </Accordion>
    </div>
  );
}
