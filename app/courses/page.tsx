import CourseCard from "../_components/profileComp/CourseCard";
import CoursesRow from "../_components/profileComp/CoursesRow";
import { searchCourse } from "../_services/courses";
import { CourseResponse } from "../_services/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchQuery = (await searchParams).q;
  const courses = await searchCourse(searchQuery === undefined ? "" : searchQuery);
  return (
    <div className="px-8 py-10">
      {courses.length === 0 ? (
        <div>
          <h2 className="text-2xl mb-5">
            Sorry, we couldn&apos;t find any results for{" "}
            <span className="font-bold">{`"${searchQuery}"`}</span>
          </h2>
          <div>
            <h3 className="text-xl">Try adjusting your search. Here are some ideas:</h3>
            <ul className="list-disc pl-10">
              <li>Make sure all words are spelled correctly</li>
              <li>Try different search terms</li>
              <li>Try more general search terms</li>
            </ul>
          </div>
        </div>
      ) : (
        <CoursesRow>
          {courses.map((course: CourseResponse) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </CoursesRow>
      )}
    </div>
  );
}
