"use client";

import { CourseResponse } from "@/app/_services/types";
import { getUserData } from "@/store/authSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import AddToCartButton from "../courseStudentDetails/AddToCartButton";
import AddToWishlistButton from "../courseStudentDetails/AddToWishlistButton";
import { getEnrollmentsState } from "@/store/enrollmentsSlice";
import { Button } from "@/components/ui/button";
import { MouseEvent } from "react";
import { FaStar } from "react-icons/fa6";

export default function CourseCard({ course }: { course: CourseResponse }) {
  const router = useRouter();
  const { role, id } = useSelector(getUserData);
  const { enrollments } = useSelector(getEnrollmentsState);
  const isEnrolled = enrollments.some((e) => e.courseId === course.id);
  const isTheCourseInstrutor =
    role === "Instructor" && id === course.instructor_id;

  function handleClick() {
    if (role === "Instructor" && course.instructor_id === id) {
      router.push(`/courseDetails/${course.id}`);
    } else {
      router.push(`/course/${course.id}`);
    }
  }

  function handleGoToCourseClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    const enrolled = enrollments.find((e) => e.courseId === course.id);
    router.push(`/learn/${enrolled.id}`);
  }

  return (
    <div
      className="bg-white flex flex-col gap-2 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 w-full p-4 border border-slate-300"
      onClick={handleClick}
    >
      <div className="relative aspect-video">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="rounded-2xl"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="flex grow flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
          <p className="line-clamp-2 text-sm text-gray-500">
            {course.description}
          </p>
          <div className="flex items-center gap-2">
            <p className="flex items-center">
              <span className="text-yellow-600 font-semibold">
                {course.avgRating}
              </span>
              <FaStar className="text-yellow-600" />
            </p>
            <p className="text-sm text-gray-500">({course.numberOfRatings})</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-md text-black font-bold">${course.price}</p>
          {(role === "Student" || role === "") && (
            <div>
              {isEnrolled ? (
                <div>
                  <Button
                    className="bg-transparent cursor-pointer text-emerald-600 border-emerald-600 border-1 text-md hover:bg-emerald-600/10"
                    onClick={handleGoToCourseClick}
                  >
                    Go to course
                  </Button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <AddToCartButton course={course} isInWishlistPage={false} />
                  <AddToWishlistButton
                    course={course}
                    isInWishlistPage={false}
                  />
                </div>
              )}
            </div>
          )}

          {isTheCourseInstrutor && (
            <Button className="bg-transparent cursor-pointer text-emerald-600 border-emerald-600 border-1 text-md hover:bg-emerald-600/10">
              View Course
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
