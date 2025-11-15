"use client";

import { fetchClientSecret } from "@/app/_lib/actions";
import { getCartItems } from "@/store/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
// import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const stripePromise = await loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function CartCheckout() {
  const cartItems = useSelector(getCartItems);

  async function makePayment() {
    const session = await fetchClientSecret(cartItems);

    await stripePromise.redirectToCheckout({
      sessionId: session.session_id,
    });
  }

  if (cartItems.length === 0) return;
  return (
    <>
      <div className="hidden md:block bg-slate-100 p-3 border border-slate-300">
        <p className="text-gray-500 font-bold">Total:</p>
        <p className="font-bold text-2xl">
          ${cartItems.reduce((acc, cur) => (acc += cur.course.price), 0)}
        </p>
        <button
          onClick={() => makePayment()}
          className="bg-emerald-600 border-2 px-2 transition duration-300 py-1.5 w-full text-white rounded-lg border-emerald-600 cursor-pointer hover:bg-transparent hover:text-black  mt-4 whitespace-nowrap"
        >
          Proceed to checkout
        </button>
      </div>
      <div className="md:hidden bg-slate-100 p-3 border  border-slate-300  w-full">
        <p className="text-gray-500 font-bold">
          Total:{" "}
          <span className="font-bold text-2xl text-black">
            ${cartItems.reduce((acc, cur) => (acc += cur.course.price), 0)}
          </span>
          <button
            onClick={() => makePayment()}
            className="bg-emerald-600 border-2 px-2 transition duration-300 py-1.5 w-full text-white rounded-lg border-emerald-600 cursor-pointer hover:bg-transparent hover:text-black  mt-4 whitespace-nowrap"
          >
            Proceed to checkout
          </button>
        </p>
      </div>
    </>
  );
}
