"use client";

import { CourseResponse } from "@/app/_services/types";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import AddToWishlistButton from "./AddToWishlistButton";
import { useSelector } from "react-redux";
import { getEnrollmentsState } from "@/store/enrollmentsSlice";
import { Button } from "@/components/ui/button";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";

export default function CourseHeader({ course }: { course: CourseResponse }) {
  const enrollments = useSelector(getEnrollmentsState);
  const isEnrolled = enrollments.enrollments.some(
    (enr) => enr.courseId === course.id
  );
  const router = useRouter();

  function handleGoToCourseClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    const enrolled = enrollments.enrollments.find(
      (e) => e.courseId === course.id
    );
    router.push(`/learn/${enrolled.id}`);
  }
  return (
    <div className="grid grid-cols-[1fr] md:grid-cols-[1.5fr_1fr] w-full  gap-2">
      <div className="flex flex-col gap-4 order-2 md:order-1">
        <h2 className="text-3xl font-bold">{course.title}</h2>
        <h4 className="font-medium">{course.description}</h4>
        <p className="font-medium">
          Created by{" "}
          <Link
            className="text-emerald-600 hover:underline"
            href={`/instructors/${course.instructor_id}`}
          >
            {course.instructor_name}
          </Link>
        </p>
        <p className="font-medium">
          Published at{" "}
          <span className="font-medium">{course.created_at.split("T")[0]}</span>
        </p>
        <div className="flex justify-between">
          <p className="text-2xl font-bold">{course.price}$</p>
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
            <div className="flex gap-2">
              <AddToCartButton course={course} isInWishlistPage={false} />
              <AddToWishlistButton course={course} isInWishlistPage={false} />
            </div>
          )}
        </div>
      </div>

      <div className="order-1 md:order-2 space-y-4">
        <div className="relative aspect-video">
          <Image
            className="border-2 border-amber-500 rounded-2xl"
            fill
            src={course.thumbnail_url}
            alt={`Cover of ${course.title} course`}
          />
        </div>
      </div>
    </div>
  );
}
