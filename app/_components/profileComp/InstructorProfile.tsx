"use client";

import { useEffect, useState } from "react";
import StatsRow from "./StatsRow";
import YourCourses from "./YourCourses";
import { getAllCoursesForInstructor } from "@/app/_services/courses";
import { toast } from "sonner";
import { CourseResponse } from "@/app/_services/types";
import { EmptyProfile } from "./EmptyProfile";
import Loader from "../ui/Loader";

export default function InstructorProfile({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<CourseResponse[] | null>(null);

  useEffect(() => {
    async function fetchInstructorCourses() {
      try {
        setIsLoading(true);
        const courses = await getAllCoursesForInstructor(id);
        setCourses(courses);
      } catch {
        toast.error("An error occurred during fetching courses");
      } finally {
        setIsLoading(false);
      }
    }

    fetchInstructorCourses();
  }, [id]);

  if (!id || courses === null) return <Loader />;
  if (!isLoading && courses?.length === 0) return <EmptyProfile />;

  return (
    <div>
      <StatsRow id={id} />
      <YourCourses courses={courses} />
    </div>
  );
}
