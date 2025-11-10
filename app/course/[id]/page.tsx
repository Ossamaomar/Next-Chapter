import CourseHeader from "@/app/_components/courseStudentDetails/CourseHeader";
import CourseSections from "@/app/_components/section/CourseSections";
import { getCourseById } from "@/app/_services/courses";
import { getLecturesByCourse } from "@/app/_services/lectures";
import { getCourseSections } from "@/app/_services/sections";

export default async function CoursePage({ params }) {
  const { id } = await params;
  const sections = await getCourseSections(id);
  const lectures = await getLecturesByCourse(id);
  const course = await getCourseById(id);

  return <div className="px-8 py-10 lg:w-[950px] space-y-10 mx-auto">
      <CourseHeader course={course} />
      <CourseSections course={course} sections={sections} lectures={lectures} />
  </div>;
}
