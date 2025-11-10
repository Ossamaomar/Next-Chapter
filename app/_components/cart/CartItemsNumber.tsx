"use client";

import { getCartState } from "@/store/cartSlice";
import { useSelector } from "react-redux";

export default function CartItemsNumber() {
  const { userHasCart, cartItems } = useSelector(getCartState);

  if (!userHasCart || cartItems.length === 0) return;
  return (
    <div className="mb-4">
      <p className="font-semibold text-lg">
        {cartItems.length} Courses in Cart
      </p>
    </div>
  );
}
