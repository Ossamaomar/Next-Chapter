import InstructorAbout from "@/app/_components/instructor/InstructorAbout";
import InstructorCourses from "@/app/_components/instructor/InstructorCourses";
import InstructorHeader from "@/app/_components/instructor/InstructorHeader";
import InstructorHero from "@/app/_components/instructor/InstructorHero";
import InstructorStats from "@/app/_components/instructor/InstructorStats";
import { getInstructorInfo } from "@/app/_services/auth";
import { getAllCoursesForInstructor } from "@/app/_services/courses";
import { getNumberOfEnrollmentsForInstructor } from "@/app/_services/enrollments";
import { getNumOfRatingsForInstructor } from "@/app/_services/ratings";
import { InstructorInfo } from "@/app/_services/types";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const instructor: InstructorInfo = await getInstructorInfo(id);
  const numberOfStudents = await getNumberOfEnrollmentsForInstructor(id); 
  const numberOfRatings = await getNumOfRatingsForInstructor(id); 
  const courses = await getAllCoursesForInstructor(id)

  return (
    <div className="grid grid-cols-3 relative">
      <div className="col-span-3">
        <InstructorHeader name={instructor.name} title={instructor.title} />
      </div>
      <div className="px-8 mb-10 space-y-8 col-span-3 lg:col-span-2 ">
        <InstructorHero imgSrc={instructor.personalPictureUrl} links={instructor.links} />
        <InstructorStats students={numberOfStudents.length} ratings={numberOfRatings} />
        <InstructorAbout description={instructor.description} />
        <InstructorCourses courses={courses} />
      </div>
    </div>
  );
}
