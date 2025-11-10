import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiDotsVertical } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { deleteSectionThunk, getSecionSelected, getSecionsState, modifySectionOrder, removeSection, selectSection, updateSectionsOrderThunk } from "@/store/courseSectionsSlice";

export default function ActionMenu({
  id,
  order_index,
}: {
  id: string;
  order_index: number;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const selectedSection = useSelector(getSecionSelected);
  const sections = useSelector(getSecionsState);
  // const isSelected = id === selectedSection;

  function handleDelete() {
    dispatch(removeSection({ id, order_index }));
    dispatch(deleteSectionThunk(id));
  }

  function handleSelect() {
    if (selectedSection) dispatch(selectSection(""));
    else dispatch(selectSection(id));
  }

  function handleChangeOrder(type: "up" | "down") {
    if (type === "up" && order_index !== 0) {
      dispatch(modifySectionOrder({ order: order_index, type: type }));
      dispatch(updateSectionsOrderThunk());
    }

    if (type === "down" && order_index !== sections.length - 1) {
      dispatch(modifySectionOrder({ order: order_index, type: type }));
      dispatch(updateSectionsOrderThunk());
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="block md:hidden">
        <Button variant="outline">
          <HiDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {/* <div className=" hover:bg-gray-100 py-1.5 rounded-sm px-2"><EditLectureDialog lecture={lecture} /></div> */}
        <DropdownMenuItem  onClick={() => handleChangeOrder("up")}>
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem  onClick={() => handleChangeOrder("down")}>
          Move down
        </DropdownMenuItem>
        <DropdownMenuItem  onClick={handleSelect}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem  onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
