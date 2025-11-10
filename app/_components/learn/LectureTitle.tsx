import { CourseLecture } from "@/app/_services/types";
import React from "react";
import { ExpandableText } from "../ui/ExpandableText";

export default function LectureTitle({ lecture }: { lecture: CourseLecture }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold">{lecture?.title}</h2>
      {/* <p className="text-lg text-slate-600">{lecture?.description}</p> */}
      <ExpandableText text={lecture?.description} wordLimit={10} />
    </div>
  );
}
