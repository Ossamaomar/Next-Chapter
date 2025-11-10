import { EditType } from "@/app/_services/types";
import { Button } from "@/components/ui/button";
import { getEditingType, setEditSession, setEditTypeNone } from "@/store/courseMetaSlice";
import { TiPencil } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

export default function EditButton({ editType, isDisabled }: { editType: EditType, isDisabled: boolean }) {
  const dispatch = useDispatch();
  const edit = useSelector(getEditingType);

  function handleEdit() {
    dispatch(setEditSession(editType));
    if (edit === editType) {
      dispatch(setEditTypeNone());
    }
  }

  return (
    <Button
      size={"sm"}
      className="border-2 bg-white border-black text-black transition duration-300 hover:text-white"
      onClick={handleEdit}
      disabled={isDisabled}
    >
      {edit === editType ? <FaCheck className="text-emerald-600" /> : <TiPencil size={25} />}
    </Button>
  );
}
