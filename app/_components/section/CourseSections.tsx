"use client";

import { useEffect } from "react";
import Sections from "./Sections";
import AddSection from "./AddSection";
import { useDispatch, useSelector } from "react-redux";
import {
  getSecionsState,
  setSectionsFetched,
} from "@/store/courseSectionsSlice";
import { setLecturesFetched } from "@/store/courseLecturesSlice";
import {
  CourseLecture,
  CourseResponse,
  CourseSection,
} from "@/app/_services/types";
import { getUserData } from "@/store/authSlice";
import {
  getEnrollmentsState,
  getLearningModeState,
} from "@/store/enrollmentsSlice";

import { RatingDialog } from "../learn/RatingDialog";
import { getEnrollmentRatingState } from "@/store/ratingSlice";

export default function CourseSections({
  course,
  sections,
  lectures,
}: {
  course: CourseResponse;
  sections: CourseSection[];
  lectures: CourseLecture[];
}) {
  const dispatch = useDispatch();
  const sectionsState = useSelector(getSecionsState);
  const user = useSelector(getUserData);
  const sortedSections = [...sectionsState].sort(
    (a, b) => a.order_index - b.order_index
  );
  const learningMode = useSelector(getLearningModeState);
  const enrollments = useSelector(getEnrollmentsState);
  const selectedEnrollment = enrollments.enrollments.find(
    (enr) => enr?.courseId === course.id
  );
  const rating = useSelector(getEnrollmentRatingState);

  useEffect(() => {
    dispatch(setSectionsFetched(sections));
    dispatch(setLecturesFetched(lectures));
  }, [dispatch, sections, lectures]);

  return (
    <div className="relative space-y-4">
      <div className="relative flex justify-between items-center ">
        <h2
          className={`text-2xl md:text-2xl font-medium   ${
            learningMode && "sticky top-0 bg-white mb-0 z-50"
          }`}
        >
          Course Content
        </h2>

        {learningMode && (
          <RatingDialog enrollment={selectedEnrollment} rating={rating} />
        )}
      </div>
      <Sections courseSections={sortedSections} />
      {user.role === "Instructor" && user.id === course.instructor_id && (
        <AddSection />
      )}
    </div>
  );
}
