"use client";

import { getCartState } from "@/store/cartSlice";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import CartItemsNumber from "./CartItemsNumber";
import CartCheckout from "./CartCheckout";

export default function CartContainer() {
  const { userHasCart, cartItems } = useSelector(getCartState);
  return (
    <div>
      <CartItemsNumber />
      <div className="flex gap-4 justify-between items-start">
        <div className="flex flex-col w-full justify-between ">
          {userHasCart && cartItems.length > 0 ? (
            cartItems.map((item) => <CartItem key={item.id} cartItem={item} />)
          ) : (
            <EmptyCart />
          )}
        </div>
        {userHasCart && (
          <div className="relative">
            <CartCheckout />
          </div>
        )}
      </div>
    </div>
  );
}
