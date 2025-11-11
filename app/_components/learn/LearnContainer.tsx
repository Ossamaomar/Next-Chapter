"use client";

// import { getUserData } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import LectureVideo from "./LectureVideo";
import LectureTitle from "./LectureTitle";
import ContentSection from "./ContentSection";
import {
  CourseLecture,
  CourseResponse,
  CourseSection,
  Enrollment,
  LectureProgress,
} from "@/app/_services/types";
import {
  getCurrentWatchedLectureState,
  getLearningModeState,
  setCurrentWatchedLecture,
  setLearningMode,
  setLecturesProgress,
  updateEnrollmentProgressState,
} from "@/store/enrollmentsSlice";
import { useEffect, useRef, useState, useTransition } from "react";
// import { getAppState } from "@/store/appSlice";
import { findFirstNotCompletedLecture, sortLectures } from "@/app/_lib/helpers";
import { useRouter } from "next/navigation";
import {
  checkLectureProgress,
  updateEnrollmentProgress,
} from "@/app/_services/enrollments";
import CourseOverview from "./CourseOverview";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clearRating, getEnrollmentRatingState, setRating } from "@/store/ratingSlice";
import { getRating } from "@/app/_services/ratings";
import CourseFeedback from "./CourseFeedback";

export default function LearnContainer({
  course,
  enrollment,
  sections,
  lectures,
  lecturesProgress,
  searchParams
}: {
  course: CourseResponse;
  enrollment: Enrollment;
  sections: CourseSection[];
  lectures: CourseLecture[];
  lecturesProgress: LectureProgress[];
  searchParams: string;
}) {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const lectureIdParam = searchParams.get("lecture");
  const lectureIdParam = searchParams
  const dispatch = useDispatch();
  // const user = useSelector(getUserData);
  const learningMode = useSelector(getLearningModeState);
  const currentLecture = useSelector(getCurrentWatchedLectureState);
  const rating = useSelector(getEnrollmentRatingState);
  // const appInitialized = useSelector(getAppState);
  // const isUserEnrolledCourse =
    // enrollment.courseId === course.id && user.id === enrollment.studentId;
  const firstNotCompletedLecture = findFirstNotCompletedLecture(
    lecturesProgress,
    lectures
  );
  const sortedLectures = sortLectures(lectures);
  const [isPending, startTransition] = useTransition();

  const videoRef = useRef<HTMLDivElement | null>(null);
  const [videoHeight, setVideoHeight] = useState<number>(0);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsLargeScreen(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) =>
      setIsLargeScreen(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);
  // Measure video height when it changes or window resizes
  useEffect(() => {
    function updateHeight() {
      if (videoRef.current) {
        setVideoHeight(videoRef.current.clientHeight);
      }
    }

    updateHeight(); // initial
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [currentLecture, isPending]);

  useEffect(() => {
    dispatch(setLearningMode(true));
    dispatch(setLecturesProgress(lecturesProgress));
    return () => {
      dispatch(setLearningMode(false));
      dispatch(setLecturesProgress([]));
    };
  }, [learningMode, lecturesProgress, dispatch]);

  useEffect(() => {
    if (lectureIdParam) {
      dispatch(
        setCurrentWatchedLecture(
          lectures.find((lec) => lec.id === lectureIdParam)
        )
      );
    } else {
      dispatch(setCurrentWatchedLecture(firstNotCompletedLecture));
    }
  }, [dispatch, firstNotCompletedLecture, lectureIdParam, lectures]);

  useEffect(() => {
    async function completeLec() {
      const curLecProgress = lecturesProgress.find(
        (lec) =>
          lec?.lectureId === currentLecture?.id &&
          lec?.enrollmentId === enrollment?.id
      );
      await checkLectureProgress(
        curLecProgress?.enrollmentId,
        curLecProgress?.lectureId,
        true
      );

      const totalDuartion = lecturesProgress
        .filter((lec) => lec.isCompleted === true)
        .reduce((acc, cur) => (acc += cur.duration), 0);

      if (totalDuartion !== course.duration) {
        const newProgress =
          ((currentLecture.duration + totalDuartion) / course.duration) * 100;

        await updateEnrollmentProgress(enrollment.id, newProgress);
        dispatch(
          updateEnrollmentProgressState({
            id: enrollment.id,
            newProgress: newProgress,
          })
        );
      }
    }
    if (currentLecture?.id && enrollment.id) {
      completeLec();
    }
  }, [
    course.duration,
    currentLecture?.duration,
    currentLecture?.id,
    dispatch,
    enrollment?.id,
    lecturesProgress,
  ]);

  useEffect(() => {   
    async function fetchRating() {
      const res = await getRating(enrollment?.id);
      if (res) {
        dispatch(setRating(res))
      }
    }

    fetchRating();
    return () => {
      dispatch(clearRating())
    }
  }, [dispatch, enrollment?.id])
  

  function onNextLecture() {
    const curLecIdx = sortedLectures.findIndex(
      (lec) => lec.id === currentLecture.id
    );
    const isLast = curLecIdx === sortedLectures.length - 1;

    if (isLast) {
      return false;
    } else {
      try {
        // await completeLec();
        const params = new URLSearchParams(searchParams);
        params.set("lecture", sortedLectures[curLecIdx + 1].id);
        startTransition(() => {
          router.push(`?${params.toString()}`);
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  function onPrevioustLecture() {
    const curLecIdx = sortedLectures.findIndex(
      (lec) => lec.id === currentLecture.id
    );
    const isFirst = curLecIdx === 0;

    if (isFirst) {
      return false;
    } else {
      const params = new URLSearchParams(searchParams);
      params.set("lecture", sortedLectures[curLecIdx - 1].id);
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative grid lg:grid-cols-3 gap-4 items-start">
        <div ref={videoRef} className="lg:col-span-2">
          <LectureVideo
            lecture={currentLecture}
            onNext={onNextLecture}
            onPrev={onPrevioustLecture}
            isLoading={isPending}
          />
        </div>

        <div
          className={`hidden lg:block overflow-y-auto sticky top-0  `}
          style={
            isLargeScreen && videoHeight
              ? { height: `${videoHeight}px` }
              : undefined
          }
        >
          <ContentSection
            course={course}
            sections={sections}
            lectures={lectures}
          />
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2">
          <LectureTitle lecture={currentLecture} />
        </div>
        <div>
          <CourseOverview course={course} />
        </div>
      </div>

      <div className="lg:hidden w-full flex-col gap-6">
        <Tabs defaultValue="lecture">
          <TabsList>
            <TabsTrigger value="lecture">Lecture</TabsTrigger>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="overview">Course Overview</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          <TabsContent value="lecture">
            <LectureTitle lecture={currentLecture} />
          </TabsContent>
          <TabsContent value="content">
            <ContentSection
              course={course}
              sections={sections}
              lectures={lectures}
            />
          </TabsContent>
          <TabsContent value="overview">
            <CourseOverview course={course} />
          </TabsContent>
          <TabsContent value="feedback">
            <CourseFeedback enrollment={enrollment} rating={rating}  />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
