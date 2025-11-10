"use client";

import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";

import DeleteModal from "../ui/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSectionThunk,
  getSecionSelected,
  getSecionsState,
  modifySectionOrder,
  removeSection,
  selectSection,
  updateSectionsOrderThunk,
} from "@/store/courseSectionsSlice";
import { MdCancel } from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { AppDispatch } from "@/store/store";

export default function ActionBtns({
  id,
  order_index,
}: {
  id: string;
  order_index: number;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const selectedSection = useSelector(getSecionSelected);
  const sections = useSelector(getSecionsState);
  const isSelected = id === selectedSection;

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
    <div
      className="md:flex items-center gap-2 h-full   hidden">
      <Button
        onClick={() => handleChangeOrder("up")}
        className="border-2 bg-emerald-600 border-emerald-600 transition duration-300 hover:bg-white hover:text-black"
      >
        <FaArrowUp />
      </Button>

      <Button
        onClick={() => handleChangeOrder("down")}
        className="border-2 bg-emerald-600 border-emerald-600 transition duration-300 hover:bg-white hover:text-black"
      >
        <FaArrowDown />
      </Button>

      <Button
        onClick={handleSelect}
        className="border-2 border-yellow-300 text-yellow-700 hover:bg-white hover:text-black bg-yellow-300 font-medium text-sm px-2 py-2 rounded-lg  transition duration-300 "
      >
        {isSelected ? <MdCancel /> : <TbEdit />}
      </Button>

      <DeleteModal onDelete={handleDelete}>
        <div
          role="button"
          className="border-2 border-red-300 text-red-800 hover:bg-white hover:text-black bg-red-300 font-medium text-sm px-3 py-[9.5px] rounded-lg "
        >
          <RiDeleteBin6Line />
        </div>
      </DeleteModal>
    </div>
  );
}
