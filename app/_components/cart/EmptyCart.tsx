"use client";
import { useRouter } from "next/navigation";

export default function EmptyCart() {
  const router = useRouter();

  return (
    <div>
      <p className="font-medium text-xl text-center">
        You currently don&apos;t have a cart, browse courses to add them to your
        cart
      </p>

      <button
        onClick={() => router.push("/courses")}
        className="bg-emerald-600 border-2 transition duration-300 py-1.5 px-2 text-white rounded-lg border-emerald-600 cursor-pointer hover:bg-transparent hover:text-black mx-auto block mt-4"
      >
        Browse Courses
      </button>
    </div>
  );
}
