import { useAddToWishlist } from "@/app/_hooks/useAddToWishlist";
import useRemoveFromWishlist from "@/app/_hooks/useRemoveFromWishlist";
import { CourseResponse } from "@/app/_services/types";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/store/authSlice";
import { deleteItemThunk, getCartItems } from "@/store/cartSlice";
import { AppDispatch } from "@/store/store";
import { getWishlistItemsState } from "@/store/wishlistSlice";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";
import React, { MouseEvent, ReactNode } from "react";
import { FaHeart } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function AddToWishlistButton({
  children,
  course,
  isInWishlistPage,
}: {
  children?: ReactNode;
  course: CourseResponse;
  isInWishlistPage: boolean;
}) {
  const { handleAddToWishlist } = useAddToWishlist();
  const { handleDeleteFromWishlist } = useRemoveFromWishlist();
  const wishlistItems = useSelector(getWishlistItemsState);
  const cartItems = useSelector(getCartItems);
  const isInWishlist = wishlistItems.some(
    (item) => item.courseId === course.id
  );
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(getUserData);
  const router = useRouter();

  function handleWishlistBtn(
    e: MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) {
    e.stopPropagation();

    if (user.id === "") {
      router.push("/auth/login");
      return;
    }

    if (isInWishlist) {
      handleDeleteFromWishlist(course.id);
    } else {
      const cartItem = cartItems.filter((item) => item.course.id === course.id);
      if (cartItem.length > 0) {
        dispatch(deleteItemThunk(cartItem[0].id));
      }
      handleAddToWishlist(course.id);
    }
  }

  if (isInWishlistPage)
    return <div onClick={handleWishlistBtn}>{children}</div>;

  return (
    <Button
      className="bg-transparent cursor-pointer text-emerald-600 border-emerald-600 
                 border-1 hover:bg-emerald-600/10"
      onClick={handleWishlistBtn}
    >
      {isInWishlist ? <FaHeart /> : <FiHeart />}
    </Button>
  );
}
