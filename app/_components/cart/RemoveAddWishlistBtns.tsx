import { useAddToWishlist } from "@/app/_hooks/useAddToWishlist";
import { CartItem } from "@/app/_services/types";
import { Button } from "@/components/ui/button";
import { deleteCartItemFromSlice, deleteItemThunk } from "@/store/cartSlice";
import { AppDispatch } from "@/store/store";
// import { getWishlistItemsState } from "@/store/wishlistSlice";
import React from "react";
import { useDispatch } from "react-redux";

export default function RemoveAddWishlistBtns({
  cartItem,
}: {
  cartItem: CartItem;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { handleAddToWishlist } = useAddToWishlist();
  function handleDelete() {
    dispatch(deleteCartItemFromSlice(cartItem));
    dispatch(deleteItemThunk(cartItem.id));
  }

  function handleMoveToWishlist() {
    dispatch(deleteCartItemFromSlice(cartItem));
    dispatch(deleteItemThunk(cartItem.id));
    handleAddToWishlist(cartItem.course.id);
  }

  return (
    <>
      <Button
        size="sm"
        className="w-fit px-1 bg-transparent cursor-pointer text-emerald-600 border-emerald-600  hover:bg-emerald-600/10"
        onClick={handleDelete}
      >
        Remove
      </Button>
      <Button
        size="sm"
        className="w-fit px-1 bg-transparent cursor-pointer text-emerald-600 border-emerald-600  hover:bg-emerald-600/10"
        onClick={handleMoveToWishlist}
      >
        Move to wishlist
      </Button>
    </>
  );
}
