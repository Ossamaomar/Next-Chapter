"use client";

import { useDispatch, useSelector } from "react-redux";
import EditButton from "./EditButton";
import { editCoursePrice, getCourseMetaState } from "@/store/courseMetaSlice";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursePrice() {
  const {
    isEditing,
    editType,
    currentState: { price: currentPrice },
    lastFetched: { price: lastPrice },
  } = useSelector(getCourseMetaState);

  const dispatch = useDispatch();

  function handleChange(text: number) {
    dispatch(editCoursePrice(text));
  }

  if(!lastPrice) return <Skeleton className="h-8 w-full  bg-gray-300" />
  return (
    <div className="flex gap-4 items-center justify-between ">
      {editType === "price" ? (
        <Input
          value={currentPrice}
          type="number"
          onChange={(e) => handleChange(Number(e.target.value))}
        />
      ) : (
        <h4 className="font-semibold text-2xl">
          {isEditing ? currentPrice : lastPrice}$
        </h4>
      )}

      <EditButton editType="price" isDisabled={!currentPrice} />
    </div>
  );
}
