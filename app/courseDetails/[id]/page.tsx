import CourseMeta from "@/app/_components/courseInstructorDetails/CourseMeta";
import CourseSections from "@/app/_components/section/CourseSections";
import { getCourseById } from "@/app/_services/courses";
import { getLecturesByCourse } from "@/app/_services/lectures";
import { getCourseSections } from "@/app/_services/sections";


export default async function CourseDetailsPage({ params }) {
  const {id} = await params;
  const sections = await getCourseSections(id);
  const lectures = await getLecturesByCourse(id);
  const course = await getCourseById(id);

  return (
    <div className="px-8 py-10 lg:w-[950px] mx-auto">
      <CourseMeta course={course} />
      <CourseSections course={course} sections={sections} lectures={lectures} />
    </div>
  );
}
