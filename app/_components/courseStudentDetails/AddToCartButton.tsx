"use client";

import { useAddToCart } from "@/app/_hooks/useAddToCart";
import { CourseResponse } from "@/app/_services/types";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/store/authSlice";
import { getCartItems } from "@/store/cartSlice";
import { AppDispatch } from "@/store/store";
import {
  deleteWishlistItemFromSlice,
  deleteWishlistItemThunk,
  getWishlistItemsState,
} from "@/store/wishlistSlice";
import { useRouter } from "next/navigation";
import React, { MouseEvent, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AddToCartButton({
  children,
  course,
  isInWishlistPage,
}: {
  course: CourseResponse;
  children?: ReactNode;
  isInWishlistPage: boolean;
}) {
  const { handleAddToCart } = useAddToCart();
  const cartItems = useSelector(getCartItems);
  const wishlistItems = useSelector(getWishlistItemsState);
  const isInCart = cartItems.some((item) => item.courseId === course.id);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(getUserData);

  function handleCartBtn(e: MouseEvent<HTMLButtonElement | HTMLDivElement>) {
    e.stopPropagation();
    
    if (user.id === "") {
      router.push("/auth/login");
      return;
    }

    if (isInCart) {
      router.push("/cart");
    } else {
      const wishlistItem = wishlistItems.filter(
        (item) => item.course.id === course.id
      );
      if (wishlistItem.length > 0) {
        dispatch(deleteWishlistItemFromSlice(wishlistItem[0]));
        dispatch(deleteWishlistItemThunk(wishlistItem[0].id));
      }
      handleAddToCart(course.id);
    }
  }
  if (isInWishlistPage) return <div onClick={handleCartBtn}>{children}</div>;

  return (
    <Button
      className="bg-transparent cursor-pointer text-emerald-600 border-emerald-600 border-1 text-md hover:bg-emerald-600/10"
      onClick={handleCartBtn}
    >
      {isInCart ? "Go to cart" : "Add to cart"}
    </Button>
  );
}
