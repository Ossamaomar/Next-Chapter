"use client";

import { useDispatch, useSelector } from "react-redux";
import EditButton from "./EditButton";
import { editCourseDescription, getCourseMetaState } from "@/store/courseMetaSlice";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDescription() {
  const {
    isEditing,
    editType,
    currentState: { description: currentDescription },
    lastFetched: { description: lastDescription },
  } = useSelector(getCourseMetaState);

  const dispatch = useDispatch();

  function handleChange(text: string) {
    dispatch(editCourseDescription(text));
  }

  if(!lastDescription) return <Skeleton className="h-8 w-full  bg-gray-300" />
  return (
    <div className="flex gap-4 items-start justify-between">
      {editType === "description" ? (
        <Textarea
          value={currentDescription}
          onChange={(e) => handleChange(e.target.value)}
        />
      ) : (
        <p className="font-normal text-lg ">
          {isEditing ? currentDescription : lastDescription}
        </p>
      )}

      <EditButton editType="description" isDisabled={!currentDescription} />
    </div>
  );
}
