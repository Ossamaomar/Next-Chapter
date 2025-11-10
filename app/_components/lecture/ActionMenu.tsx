import { deleteLectureApi } from "@/app/_services/lectures";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteLecture, deleteLectureThunk } from "@/store/courseLecturesSlice";
import {  useState } from "react";

import { HiDotsVertical } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { EditLectureDialog } from "./EditLectureDialog";
import { CourseLecture } from "@/app/_services/types";
import { AppDispatch } from "@/store/store";


export default function ActionMenu({lecture}: {lecture: CourseLecture; }) {
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  async function handleDelete() {
    try {
      setIsLoadingDelete(true);
      // await deleteLectureApi(lecture);
      // dispatch(deleteLecture({id: lecture.id}))
      dispatch(deleteLectureThunk(lecture))
      toast.success("Lecture deleted successfully");
    } catch {
      toast.error("An error occured during deleting lecture")
    } finally {
      setIsLoadingDelete(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"><HiDotsVertical /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <div className=" hover:bg-gray-100 py-1.5 rounded-sm px-2"><EditLectureDialog lecture={lecture} /></div>
        <DropdownMenuItem disabled={isLoadingDelete} onClick={handleDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


