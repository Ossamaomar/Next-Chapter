"use client";

import { editCourseById } from "@/app/_services/courses";
import { Button } from "@/components/ui/button";
import {
  getCurrentCourseState,
  getIsEditing,
  returnToInitial,
  setCourseFetched,
} from "@/store/courseMetaSlice";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function ActionBtns() {
  const dispatch = useDispatch();
  const { id }: { id: string } = useParams();
  const currentState = useSelector(getCurrentCourseState);
  const isEditing  = useSelector(getIsEditing)

  function handleCancel() {
    dispatch(returnToInitial());
  }

  async function handleChanges() {
    const res = await editCourseById(currentState, id);

    if (res) {
      toast.success("Your Course Updated Successfully");
      dispatch(
        setCourseFetched({
          title: res.title,
          description: res.description,
          price: res.price,
          thumbnail_url: res.thumbnail_url,
        })
      );
    } else {
      toast.error("An error occurred while editing your course");
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={handleCancel}
        className="bg-gray-300 font-medium text-sm px-2 py-2 rounded-lg text-black transition duration-300 hover:text-white"
      >
        Cancel
      </Button>
      <Button
        onClick={handleChanges}
        className="bg-amber-600 font-medium text-sm px-2 py-2 rounded-lg text-white"
        disabled= {!isEditing}
      >
        Save Changes
      </Button>
    </div>
  );
}
