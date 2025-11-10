import { CourseResponse } from "@/app/_services/types";
import CoursesHeader from "./CoursesHeader";

import CourseCard from "../profileComp/CourseCard";
import CoursesRow from "./CoursesRow";
import EmptyCourses from "./EmptyCourses";


export default function CoursesContainer({
  courses,
  category,
}: {
  courses: CourseResponse[];
  category: string;
}) {

  return (
    <div className="space-y-6">
      <CoursesHeader category={category} />
      {courses.length > 0 ? (
        <CoursesRow>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </CoursesRow>
      ) : (
        <EmptyCourses category={category} />
      )}
    </div>
  );
}
