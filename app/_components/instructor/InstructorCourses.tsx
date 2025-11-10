import { CourseResponse } from "@/app/_services/types";
import CourseCard from "../profileComp/CourseCard";

export default function InstructorCourses({
  courses,
}: {
  courses: CourseResponse[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">My Courses ({courses.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
