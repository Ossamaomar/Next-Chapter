"use client";

import { useDispatch, useSelector } from "react-redux";
import EditButton from "./EditButton";
import {
  editCourseTitle,
  getCourseMetaState,
  //   getCurrentCourseState,
  //   getEditingType,
  //   getIsEditing,
  //   getLastCourseState,
} from "@/store/courseMetaSlice";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseTitle() {
  const {
    isEditing,
    editType,
    currentState: { title: currentTitle },
    lastFetched: { title: lastTitle },
  } = useSelector(getCourseMetaState);
  const dispatch = useDispatch();

  function handleChange(text: string) {
    dispatch(editCourseTitle(text));
  }

  if(!lastTitle) return <Skeleton className="h-8 w-full  bg-gray-300" />

  return (
    <div className="flex gap-4 items-start justify-between">
      {editType === "title" ? (
        <Input
          type="text"
          value={currentTitle}
          className="font-semibold text-2xl"
          onChange={(e) => handleChange(e.target.value)}
        />
      ) : (
        <h2 className="font-semibold text-xl">
          {isEditing ? currentTitle : lastTitle}
        </h2>
      )}

      <EditButton editType={"title"} isDisabled={!currentTitle} />
    </div>
  );
}
