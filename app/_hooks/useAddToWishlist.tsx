import { getUserData } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseToWishlistSlice,
  createWishlistSlice,
  getWishlistState,
} from "@/store/wishlistSlice";
import { addCourseToWishlist, createWishlist } from "../_services/wishlist";

export function useAddToWishlist() {
  const { userHasWishlist, id: wishlistId } = useSelector(getWishlistState);
  const { id: studentId } = useSelector(getUserData);
  const dispatch = useDispatch();

  async function handleAddToWishlist(courseId: string) {
    console.log(userHasWishlist);
    if (userHasWishlist) {
      const wishlistItem = await addCourseToWishlist(
        courseId,
        studentId,
        wishlistId
      );
      dispatch(addCourseToWishlistSlice(wishlistItem));
      console.log("User has wishlist");
    } else {
      const wishlist = await createWishlist(studentId);
      dispatch(createWishlistSlice(wishlist));
      const wishlistItem = await addCourseToWishlist(
        courseId,
        studentId,
        wishlist.id
      );
      dispatch(addCourseToWishlistSlice(wishlistItem));
      console.log("User doesn't has wishlist");
    }
  }

  return { userHasWishlist, handleAddToWishlist };
}
