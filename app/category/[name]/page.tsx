import CoursesContainer from "@/app/_components/courses/CoursesContainer";
import { getCoursesByCategoryName } from "@/app/_services/courses";
import { CourseResponse } from "@/app/_services/types";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}) {
  const { name } = await params;
  
  const category = name.includes("%20%26%20")
    ? name
        .split("%20%26%20")
        .filter((s) => s !== "%20%26%20")
        .join(" & ")
    : name;
    
  const courses: CourseResponse[] = await getCoursesByCategoryName(category);

  return (
    <div className="px-8 py-10">
      <CoursesContainer courses={courses} category={category} />
    </div>
  );
}