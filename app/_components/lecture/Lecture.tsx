"use client";

import { PiVideo } from "react-icons/pi";
import ActionMenu from "./ActionMenu";
import { CourseLecture } from "@/app/_services/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentWatchedLectureState,
  getEnrollmentsState,
  getLearningModeState,
  getLecturesProgressState,
  setCheckedLecture,
} from "@/store/enrollmentsSlice";
import { checkLectureProgress } from "@/app/_services/enrollments";
import { getUserData } from "@/store/authSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MouseEvent } from "react";

function formatDuration(duration: number): string {
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = Math.floor(duration % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  } else {
    return `${pad(mins)}:${pad(secs)}`;
  }
}

export default function Lecture({
  lecture,
  isTheCourseInstrutor,
}: {
  lecture: CourseLecture;
  isTheCourseInstrutor: boolean;
}) {
  const { role } = useSelector(getUserData);
  const router = useRouter();
  const dispatch = useDispatch();
  const duration = formatDuration(lecture.duration);
  const enrollments = useSelector(getEnrollmentsState);
  const learningMode = useSelector(getLearningModeState);
  const lecturesProgress = useSelector(getLecturesProgressState);
  const currentWatchedLecture = useSelector(getCurrentWatchedLectureState);
  const lectureProgerss = lecturesProgress.find(
    (l) => l.lectureId === lecture.id
  );
  const isEnrolled = enrollments.enrollments.some(
    (enr) => enr?.courseId === lecture.course_id
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();

  async function onCheckLecture(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    dispatch(
      setCheckedLecture({
        value: !lectureProgerss.isCompleted,
        lectureId: lecture.id,
      })
    );
    await checkLectureProgress(
      lectureProgerss.enrollmentId,
      lectureProgerss.lectureId,
      !lectureProgerss.isCompleted
    );
  }

  function onClickLecture() {
    console.log(pathname.includes("/learn/"));
    if (isEnrolled) {
      if (!pathname.includes("/learn/")) {
        router.push(
          `/learn/${
            enrollments.enrollments.find(
              (enr) => enr?.courseId === lecture.course_id
            ).id
          }?lecture=${lecture.id}`
        );
      } else {
        const params = new URLSearchParams(searchParams);
        params.set("lecture", lecture.id);
        router.push(`?${params.toString()}`);
      }
    }
  }

  return (
    <div
      className={`bg-white text-sm border border-slate-400 border-t-0 px-2 py-4 mb-0 flex justify-between 
    ${
      learningMode && currentWatchedLecture?.id === lecture.id
        ? "bg-gray-200!"
        : ""
    }
    ${isEnrolled ? "cursor-pointer" : ""}`}
      onClick={onClickLecture}
    >
      <p className="flex gap-2 items-center">
        {learningMode && (
          <Checkbox
            defaultChecked={lectureProgerss.isCompleted}
            checked={lectureProgerss.isCompleted}
            onClick={onCheckLecture}
            className={`data-[state=checked]:border-emerald-600 
                        data-[state=checked]:bg-emerald-600 
                        data-[state=checked]:text-white`}
          />
        )}
        <PiVideo />
        {lecture.title}
      </p>
      <div className="flex items-center gap-2">
        <p>{duration}</p>
        {isTheCourseInstrutor && <ActionMenu lecture={lecture} />}
      </div>
    </div>
  );
}
