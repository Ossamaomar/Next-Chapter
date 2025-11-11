"use client";

import { getCartState } from "@/store/cartSlice";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import CartItemsNumber from "./CartItemsNumber";
import CartCheckout from "./CartCheckout";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function CartContainer() {
  const { userHasCart, cartItems } = useSelector(getCartState);
  const container = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      gsap.fromTo(
        container.current,
        { filter: "blur(10px)", opacity: 0 },
        {
          filter: "blur(0px)",
          opacity: 1,
          duration: 1.5,
          delay: 1,
          ease: "power2.out",
        }
      );
    });
  return (
    <div ref={container} className="w-full mx-auto sm:w-[500px] md:w-[700px] lg:w-[1000px] xl:w-[1200px]">
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
