import LearnContainer from "@/app/_components/learn/LearnContainer";
import { getCourseById } from "@/app/_services/courses";
import { getEnrollment } from "@/app/_services/enrollments";
import {
  getLecturesByCourse,
  getLecturesProgress,
} from "@/app/_services/lectures";
import { getCourseSections } from "@/app/_services/sections";
import {
  CourseLecture,
  CourseResponse,
  CourseSection,
  Enrollment,
  LectureProgress,
} from "@/app/_services/types";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const enrollment: Enrollment = await getEnrollment(id);
  const course: CourseResponse = await getCourseById(enrollment?.courseId);
  const sections: CourseSection[] = await getCourseSections(
    enrollment.courseId
  );
  const lectures: CourseLecture[] = await getLecturesByCourse(
    enrollment.courseId
  );
  const lecturesProgress: LectureProgress[] = await getLecturesProgress(id);

  return (
    <div className="px-8 py-10">
      <LearnContainer
        course={course}
        enrollment={enrollment}
        sections={sections}
        lectures={lectures}
        lecturesProgress={lecturesProgress}
      />
    </div>
  );
}
