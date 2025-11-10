import Image from "next/image";
import { Enrollment } from "@/app/_services/types";
import { ProgressForLearn } from "@/components/ui/progressForLearn";
import { useRouter } from "next/navigation";
import { TbPlayerPlayFilled } from "react-icons/tb";

export default function CourseLearnCard({
  enrollment,
}: {
  enrollment: Enrollment;
}) {
  const router = useRouter();
  return (
    <div
      className="relative bg-white flex flex-col gap-2 group cursor-pointer"
      onClick={() => router.push(`/learn/${enrollment.id}`)}
    >
      <div className="relative aspect-video border border-slate-600">
        <Image
          src={enrollment.courseThumbnail}
          fill
          alt={`${enrollment.courseTitle} title`}
        />
        <div
          className="bg-gray-600/60 flex opacity-0 transition duration-400 absolute top-0 bottom-0 left-0 right-0 
                      group-hover:opacity-100 justify-center items-center"
        >
          <div className="bg-gray-200 p-3 rounded-full">
            <TbPlayerPlayFilled size={28} />
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-2">
        <div>
          <h3 className="text-lg font-semibold">{enrollment.courseTitle}</h3>
          <p className="text-sm text-gray-500">{enrollment.instructorName}</p>
        </div>
        <div>
          <ProgressForLearn value={enrollment.progress} />
          <p className="text-sm">
            {enrollment.progress > 0
              ? enrollment.progress.toFixed(0) + "% complete"
              : "Start course"}
          </p>
        </div>
      </div>
    </div>
  );
}
