"use client";

import {
  createEnrollmentLecturesProgress,
  enrollCourse,
  getEnrolledCourses,
} from "@/app/_services/enrollments";
import { Enrollment } from "@/app/_services/types";
import { getAppState } from "@/store/appSlice";
import { getUserData } from "@/store/authSlice";
import {
  deleteCartSlice,
  deleteCartThunk,
  getCartId,
  getCartItems,
} from "@/store/cartSlice";
import { setEnrollments } from "@/store/enrollmentsSlice";
import { AppDispatch } from "@/store/store";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function CheckoutReturn({
  sessionId,
  status,
}: {
  sessionId: string;
  status: string;
}) {
  const router = useRouter();
  const courses = useSelector(getCartItems);
  const cartId = useSelector(getCartId);
  const appState = useSelector(getAppState);
  const { id } = useSelector(getUserData);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function handleCompletion() {
      if (status === "open") {
        toast.error("An error occurred during checkout try again");
        router.push("/cart");
      }

      if (status === "complete" && appState === true) {
        if (courses.length > 0) {
          await Promise.all(
            courses.map((course) =>
              enrollCourse(
                course.course.id,
                id,
                course.course.instructor_id,
                course.course.instructor_name,
                course.course.title,
                course.course.thumbnail_url,
              )
            )
          );
          const enrollments: Enrollment[] = await getEnrolledCourses(id);
          dispatch(setEnrollments(enrollments));
          await Promise.all(
            courses.map((course) =>
              createEnrollmentLecturesProgress(
                course.courseId,
                enrollments.find(
                  (enrollment) => enrollment.courseId === course.courseId
                )?.id,
                id
              )
            )
          );
          dispatch(deleteCartSlice());
          dispatch(deleteCartThunk(id));
        }
        router.push("/");
      }
    }
    handleCompletion();
  }, [router, status, courses, id, cartId, dispatch, appState]);

  if (!sessionId)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <div className="shadow-2xl border border-slate-200 p-4 w-fit mx-auto rounded-2xl h-52 flex flex-col justify-center gap-2">
        <div className="flex justify-center border-4 w-fit rounded-full mx-auto">
          <TiTick size={70} className="text-emerald-600" />
        </div>
        <p className="text-center text-xl ">
          You have successfully completed your purchase
        </p>
      </div>
    );
  }
}
