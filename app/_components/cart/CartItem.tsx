

import { CartItem as CartItemType } from "@/app/_services/types";
import Image from "next/image";
import Link from "next/link";
import RemoveAddWishlistBtns from "./RemoveAddWishlistBtns";

export default function CartItem({ cartItem }: { cartItem: CartItemType }) {
  return (
    <div className="w-full relative before:content-[''] before:block before:w-full before:h-[1px] before:bg-gray-400 before:absolute before:-top-4 mt-4">
      <div className="flex items-start gap-2">
        <div className="relative aspect-video w-30">
          <Image
            
            fill
            src={cartItem.course.thumbnail_url}
            alt={`Cover of ${cartItem.course.title} course`}
          />
        </div>
        <div className="flex justify-between w-full gap-4">
          <div>
            <h2 className="font-semibold text-xl">{cartItem.course.title}</h2>
            <p className="font-medium text-[14px] text-gray-500">
              Created by{" "}
              <Link
                className="text-cyan-700 hover:underline"
                href={`/instructors/${cartItem.course.instructor_id}`}
              >
                {cartItem.course.instructor_name}
              </Link>
            </p>
            <div className="flex lg:hidden  gap-1 text-sm">
              <RemoveAddWishlistBtns cartItem={cartItem} />
            </div>
          </div>
          <h4 className="font-semibold text-xl">${cartItem.course.price}</h4>
          <div className="hidden lg:flex flex-col  text-sm">
            <RemoveAddWishlistBtns cartItem={cartItem} />
          </div>
        </div>
      </div>
    </div>
  );
}
