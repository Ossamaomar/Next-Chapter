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
    <div
      ref={container}
      className="w-full mx-auto sm:w-[500px] md:w-[700px] lg:w-[1000px] xl:w-[1200px] h-full "
    >
      <CartItemsNumber />

      {userHasCart && cartItems.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 h-full ">
          <div className="col-span-3 md:col-span-2 flex flex-col w-full justify-between ">
            {cartItems.map((item) => (
              <CartItem key={item.id} cartItem={item} />
            ))}
          </div>
          <div className="col-span-3 md:col-span-1">
            <CartCheckout />
          </div>
        </div>
      ) : (
        <div>
          <EmptyCart />
        </div>
      )}
    </div>
  );
}
