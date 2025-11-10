// import { getUserData } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import {
  deleteWishlistItemFromSlice,
  deleteWishlistItemThunk,
  deleteWishlistSlice,
  getWishlistState,
} from "@/store/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteWishlist } from "../_services/wishlist";

export default function useRemoveFromWishlist() {
  const {
    // userHasWishlist,
    id: wishlistId,
    wishlistItems,
  } = useSelector(getWishlistState);
  const dispatch = useDispatch<AppDispatch>();

  async function handleDeleteFromWishlist(courseId: string) {
    const wishlistItem = wishlistItems.find(
      (item) => item.courseId === courseId
    );
    dispatch(deleteWishlistItemFromSlice(wishlistItem));
    dispatch(deleteWishlistItemThunk(wishlistItem.id));

    if (wishlistItems.length === 1) {
      console.log("Here delete")
      await deleteWishlist(wishlistId, wishlistItems);
      dispatch(deleteWishlistSlice())
    }
  }
   
  return {handleDeleteFromWishlist}
}
