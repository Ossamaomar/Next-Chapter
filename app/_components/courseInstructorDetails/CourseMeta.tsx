"use client";

import { deleteCourseById } from "@/app/_services/courses";
// import { CourseResponse } from "@/app/_services/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CourseTitle from "./CourseTitle";
import CourseDescription from "./CourseDescription";
import CoursePrice from "./CoursePrice";
import CourseThumbnail from "./CourseThumbnail";
import ActionBtns from "./ActionBtns";
import { useDispatch, useSelector } from "react-redux";
import { setCourseFetched } from "@/store/courseMetaSlice";
// import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DeleteModal from "../ui/DeleteModal";
import { getCourseLectures } from "@/store/courseLecturesSlice";
import { getSecionsState } from "@/store/courseSectionsSlice";
import { BeatLoader } from "react-spinners";
import { CourseResponse } from "@/app/_services/types";

export default function CourseMeta({ course }: { course: CourseResponse }) {
  const { id }: { id: string } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const lectures = useSelector(getCourseLectures);
  const sections = useSelector(getSecionsState);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  useEffect(() => {
    dispatch(
      setCourseFetched({
        title: course.title,
        description: course.description,
        price: course.price,
        thumbnail_url: course.thumbnail_url,
      })
    );
  }, [course, dispatch]);

  async function deleteCourse() {
    try {
      setIsLoadingDelete(true);
      const res = await deleteCourseById(id, sections, lectures);
      console.log("res is", res)
      if (res) {
        toast.success("Course deleted successfully");
        router.push("/profile");
      }
    } catch {
      toast.error("An error occurred during deleting the course");
    } finally {
      setIsLoadingDelete(false);
    }
  }

  // if (!currentState.title) return;

  return (
    <div className=" space-y-4">
      <div className="flex justify-between items-start gap-2">
        <h1 className="text-2xl lg:text-2xl font-medium">Course Meta</h1>
        <DeleteModal onDelete={deleteCourse}>
          <div
            role="button"
            className="border-2 border-red-300 text-red-800 hover:bg-white hover:text-black bg-red-300 font-medium text-sm whitespace-nowrap px-3 py-2 rounded-lg flex justify-center items-center"
          >
            {isLoadingDelete ? (
              <BeatLoader size={10} color="#9a0000" />
            ) : (
              "Delete Course"
            )}
          </div>
        </DeleteModal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="w-full order-2 space-y-2 col-span-2 ">
          <CourseTitle />
          <CourseDescription />
          <CoursePrice />
        </div>
        <div className="w-full order-1 md:order-2">
          <CourseThumbnail />
        </div>
      </div>

      <ActionBtns />
    </div>
  );
}
