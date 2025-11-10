import { formatDuration } from "@/app/_lib/helpers";
import { WishlistItem } from "@/app/_services/types";
import Image from "next/image";
import { FaHeart, FaStar } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import AddToCartButton from "../courseStudentDetails/AddToCartButton";
import AddToWishlistButton from "../courseStudentDetails/AddToWishlistButton";

export default function WishlistItemCard({ item }: { item: WishlistItem }) {
  return (
    <div>
      <div className="relative aspect-video group">
        <Image
          src={item.course.thumbnail_url}
          alt={`${item.course.title} thumbnail`}
          fill
        />
        <div
          className="bg-gray-600/60 flex opacity-0 transition duration-400 absolute top-0 bottom-0 left-0 right-0 
                              group-hover:opacity-100 justify-center items-center gap-2"
        >
          <div className="bg-gray-200 cursor-pointer p-3 rounded-full">
            <AddToCartButton course={item.course} isInWishlistPage={true}>
              <HiOutlineShoppingCart />
            </AddToCartButton>
          </div>
          <div className="bg-gray-200 cursor-pointer p-3 rounded-full">
            <AddToWishlistButton course={item.course} isInWishlistPage={true}>
              <FaHeart />
            </AddToWishlistButton>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">{item.course.title}</h3>
        <p className="text-sm text-gray-500 font-semibold">
          {item.course.instructor_name}
        </p>
        <div className="flex items-center gap-2">
          <p className="flex items-center">
            <span className="text-yellow-600 font-semibold">
              {item.course.avgRating}
            </span>
            <FaStar className="text-yellow-600" />
          </p>
          <p className="text-sm text-gray-500">
            ({item.course.numberOfRatings})
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {formatDuration(item.course.duration)} -{" "}
          {item.course.numberOfLectures} lectures
        </p>
        <p className="text-lg font-semibold">${item.course.price}</p>
        {/* <div className="flex gap-1">
            <AddToCartButton course={item.course} />
            <AddToWishlistButton course={item.course} />
          </div> */}
      </div>
    </div>
  );
}
