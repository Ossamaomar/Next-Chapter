import CourseSections from '../section/CourseSections';
import { CourseLecture, CourseResponse, CourseSection } from '@/app/_services/types';


export default function ContentSection({
  course,
  sections,
  lectures,
}: {
  course: CourseResponse;
  sections: CourseSection[];
  lectures: CourseLecture[]
}) {
  return (
    <div>
      <CourseSections course={course} lectures={lectures} sections={sections} />
    </div>
  )
}
