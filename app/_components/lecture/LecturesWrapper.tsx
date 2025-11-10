"use client";

import { getCourseLectures } from "@/store/courseLecturesSlice";
import { useSelector } from "react-redux";
import Lecture from "./Lecture";
import { AccordionContent } from "@/components/ui/accordion";
import { AddLectureDialog } from "./AddLectureDialog";
import { sortLectures } from "@/app/_lib/helpers";
import { Suspense } from "react";

export default function LecturesWrapper({
  sectionId,
  isTheCourseInstructor,
}: {
  sectionId: string;
  isTheCourseInstructor: boolean;
}) {
  const courseLectures = useSelector(getCourseLectures);
  const sortedLectures = sortLectures(courseLectures);

  const sectionLectures = sortedLectures.filter(
    (lec) => lec.section_id === sectionId
  );

  return (
    <AccordionContent className="flex flex-col divide-y ">
      {sectionLectures.map((lec) => (
        <Suspense key={lec.id}>
          <Lecture
            key={lec.id}
            isTheCourseInstrutor={isTheCourseInstructor}
            lecture={lec}
          />
        </Suspense>
      ))}

      {isTheCourseInstructor && <AddLectureDialog sectionId={sectionId} />}
    </AccordionContent>
  );
}
