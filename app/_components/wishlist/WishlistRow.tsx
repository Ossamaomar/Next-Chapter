"use client";

import WishlistItemCard from "./WishlistItemCard";
import { useSelector } from "react-redux";
import { getWishlistItemsState } from "@/store/wishlistSlice";
import WishlistEmpty from "./WishlistEmpty";

export default function WishlistRow() {
  const wishlistItems = useSelector(getWishlistItemsState);
  
  return (
    <div className="mx-auto sm:w-[500px] md:w-[700px] lg:w-[1000px] xl:w-[1200px] space-y-4">
      {wishlistItems.length > 0 ? (
        <div className="w-full grid gap-4 xl:grid-cols-4 lg:grid-cols-3  sm:grid-cols-2 grid-cols-1">
          {wishlistItems.map((item) => (
            <WishlistItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <WishlistEmpty />
      )}
    </div>
  );
}
