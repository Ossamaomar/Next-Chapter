"use client";

import { CourseResponse, InstructorInfo } from "@/app/_services/types";
import { FaStar } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { MdAccessTime } from "react-icons/md";
import { getCourseTotalRating } from "@/app/_services/ratings";
import { useEffect, useState } from "react";
import { getEnrollmentsForCourse } from "@/app/_services/enrollments";
import { getCourseById } from "@/app/_services/courses";
import { formatDuration } from "@/app/_lib/helpers";
import Link from "next/link";
import Image from "next/image";
import { getInstructorInfo } from "@/app/_services/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseOverview({ course }: { course: CourseResponse }) {
  const [avgRating, setAvgRating] = useState(0);
  const [numOfRatings, setNumOfRatings] = useState(0);
  const [numOfStudents, setNumOfStudents] = useState(0);
  const [duration, setDuration] = useState("");
  const [instructorInfo, setInstructorInfo] = useState<InstructorInfo>();

  useEffect(() => {
    async function fetchRatings() {
      try {
        const ratings = await getCourseTotalRating(course.id);
        setAvgRating(ratings.avgRating);
        setNumOfRatings(ratings.numberOfRatings);
      } catch {}
    }

    fetchRatings();
  }, [course?.id]);

  useEffect(() => {
    async function fetchNumOfStudents() {
      try {
        const enrollments = await getEnrollmentsForCourse(course.id);
        setNumOfStudents(enrollments.length);
      } catch {}
    }

    fetchNumOfStudents();
  }, [course?.id]);

  useEffect(() => {
    async function fetchDuration() {
      try {
        const res: CourseResponse = await getCourseById(course.id);
        setDuration(formatDuration(res.duration));
      } catch {}
    }

    fetchDuration();
  }, [course.id]);

  useEffect(() => {
    async function fetchInstructorImage() {
      try {
        const res: InstructorInfo = await getInstructorInfo(
          course.instructor_id
        );
        setInstructorInfo(res);
      } catch {}
    }

    fetchInstructorImage();
  }, [course.instructor_id]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{course?.title}</h2>
      <div className="flex items-center gap-6">
        <div>
          <p className="text-yellow-500 font-semibold flex items-center gap-2">
            <FaStar /> {avgRating}
          </p>
          <p className="text-xs text-gray-600">{numOfRatings} ratings</p>
        </div>
        <div>
          <p className="font-semibold flex items-center gap-2">
            <BsPersonCircle /> {numOfStudents}
          </p>
          <p className="text-xs text-gray-600">students</p>
        </div>
        <div>
          <p className="font-semibold flex items-center gap-2">
            <MdAccessTime /> {duration.split(" ")[0]}
          </p>
          <p className="text-xs text-gray-600">{duration.split(" ")[1]}</p>
        </div>
      </div>
      <Link href={`/instructors/${course.instructor_id}`}>
        <div className="flex gap-4 items-center">
          <div className="relative w-10 h-10 rounded-full">
            {instructorInfo?.id ? (
              <Image
              className="rounded-full"
                src={instructorInfo?.personalPictureUrl}
                fill
                alt={`${instructorInfo?.name} picture`}
              />
            ) : (
              <Skeleton className="w-10 h-10 rounded-full bg-gray-300" />
            )}
          </div>
          {course.instructor_name}
        </div>
      </Link>
    </div>
  );
}
