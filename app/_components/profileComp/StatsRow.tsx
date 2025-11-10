import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { PiProjectorScreenChartBold } from "react-icons/pi";
import { FaGraduationCap } from "react-icons/fa6";
import { LuBadgeDollarSign } from "react-icons/lu";
import { toast } from "sonner";
import { getAllCoursesForInstructor } from "@/app/_services/courses";
import { getNumberOfEnrollmentsForInstructor } from "@/app/_services/enrollments";
import { CourseResponse, Enrollment } from "@/app/_services/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsRow({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coursesNum, setCoursesNum] = useState<number>(null);
  const [enrollmentsNum, setEnrollmentsNum] = useState<number>(null);
  const [earnings, setEarnings] = useState<number>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        let earningsCounter = 0;
        setIsLoading(true);
        const courses: CourseResponse[] = await getAllCoursesForInstructor(id);
        const enrollments: Enrollment[] =
          await getNumberOfEnrollmentsForInstructor(id);
        setCoursesNum(courses.length);
        setEnrollmentsNum(enrollments.length);
        for (let i = 0; i < courses.length; i++) {
          const num = enrollments.filter(
            (enr) => enr.courseId === courses[i].id
          ).length;
          earningsCounter += num * courses[i].price;
        }
        setEarnings(earningsCounter);
      } catch {
        toast.error("An error occurred during fetching your profile stats");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-2 w-full justify-between items-center">
        <Skeleton className="w-full h-[100px] bg-gray-300" />
        <Skeleton className="w-full h-[100px] bg-gray-300" />
        <Skeleton className="w-full h-[100px] bg-gray-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center">
      <StatCard title="Courses" borderColor="sky" value={coursesNum}>
        <div className="border-3 border-sky-600 rounded-full p-3">
          <PiProjectorScreenChartBold className="text-sky-600" size={30} />
        </div>
      </StatCard>

      <StatCard title="Enrollments" borderColor="amber" value={enrollmentsNum}>
        <div className="border-3 border-amber-600 rounded-full p-3">
          <FaGraduationCap className="text-amber-600" size={30} />
        </div>
      </StatCard>

      <StatCard title="Earnings" borderColor="green" value={earnings}>
        <div className="border-3 border-green-600 rounded-full p-3">
          <LuBadgeDollarSign className="text-green-600" size={30} />
        </div>
      </StatCard>
    </div>
  );
}
