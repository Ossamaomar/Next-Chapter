"use client";

import { CourseSection } from "@/app/_services/types";
import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";
import ActionBtns from "./ActionBtns";
import { useSelector } from "react-redux";
import { getSecionSelected } from "@/store/courseSectionsSlice";
import EditForm from "./EditForm";
import LecturesWrapper from "../lecture/LecturesWrapper";
import {
  getDurationOfLecturesBySection,
  getNumberOfLecturesBySection,
} from "@/store/courseLecturesSlice";
import ActionMenu from "./ActionMenu";
import { getUserData } from "@/store/authSlice";
import {
  getLearningModeState,
  getLecturesProgressState,
} from "@/store/enrollmentsSlice";
import { getCompletedLecturesCount } from "@/app/_lib/helpers";

function formatSectionDuration(duration: number) {

  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);

  if (hrs) {
    return `${hrs}hr ${mins}min`;
  } else {
    if (duration < 60) {
      return `${duration}sec`;
    } else {
      return `${mins}min`;
    }
  }
}

export default function Section({ section }: { section: CourseSection }) {
  const selectedSection = useSelector(getSecionSelected);
  const user = useSelector(getUserData);
  const isSelected = section.id === selectedSection;
  const numOfLectures = useSelector(getNumberOfLecturesBySection(section.id));
  const learningMode = useSelector(getLearningModeState);
  const sectionDuration = formatSectionDuration(
    useSelector(getDurationOfLecturesBySection(section.id))
  );
  const isTheCourseInstrutor =
    user.role === "Instructor" && user.id === section.instructor_id;
  const lecturesProgress = useSelector(getLecturesProgressState);
  const completedLectures = getCompletedLecturesCount(
    lecturesProgress,
    section.order_index
  );

  return (
    <AccordionItem className="space-y-0 hover:no-underline" value={section.id}>
      <div
        className={`grid ${
          isTheCourseInstrutor ? "grid-cols-[1fr_auto]" : "grid-cols-[1fr]"
        }  items-center rounded-2xl`}
      >
        {isSelected ? (
          <EditForm initialTitle={section.name} sectionId={section.id} />
        ) : (
          <div>
            <AccordionTrigger className="bg-gray-200 px-2 border items-center border-slate-400 col-span-1 rounded-none">
              <div className="flex justify-between items-center w-full gap-2">
                <h4 className="!no-underline text-md font-semibold">
                  {section.name}
                </h4>
                {!learningMode && (
                  <div className="text-xs md:flex flex-col md:flex-row items-center justify-center md:gap-2 hidden">
                    <p className="text-nowrap">{numOfLectures} lectures</p>
                    <p>.</p>
                    <p>{sectionDuration}</p>
                  </div>
                )}
              </div>
              {learningMode && (
                <div>
                  <p className="text-nowrap text-xs">
                    {completedLectures} / {numOfLectures} | {sectionDuration}
                  </p>
                </div>
              )}
            </AccordionTrigger>
          </div>
        )}

        {isTheCourseInstrutor && (
          <div className="col-span-1 h-full bg-gradient-to-r from-blue-300 to-blue-100 flex justify-center items-center px-2  rounded-r-2xl">
            <ActionBtns id={section.id} order_index={section.order_index} />
            <ActionMenu id={section.id} order_index={section.order_index} />
          </div>
        )}
        <LecturesWrapper
          isTheCourseInstructor={isTheCourseInstrutor}
          sectionId={section.id}
        />
      </div>
    </AccordionItem>
  );
}
