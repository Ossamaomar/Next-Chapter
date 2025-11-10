import { supabase } from "../_lib/supabase";
import { getCourseById } from "./courses";
import { Wishlist, WishlistItem } from "./types";

export async function checkUserHasWishlist(id: string, role: string) {
  const res: {
    hasWishlist: boolean;
    wishlist: Wishlist;
    wishlistItems: WishlistItem[];
  } = {
    hasWishlist: false,
    wishlist: { id: "", createdAt: "", studentId: "" },
    wishlistItems: [],
  };

  if (role === "Instructor") return res;

  const { data: wishlistData, error: wishlistError } = await supabase
    .from("wishlists")
    .select("*")
    .eq("studentId", id)
    .maybeSingle();

  if (wishlistError) {
    console.error(wishlistError.message);
    return res;
  }

  if (!wishlistData) {
    return res;
  }

  res.hasWishlist = true;
  res.wishlist = wishlistData;

  const { data: wishlistItemsData, error: wishlistItemsError } = await supabase
    .from("wishlistItems")
    .select("*")
    .eq("wishlistId", wishlistData.id);

  if (wishlistItemsError) {
    console.error("Error fetching user wishlist items");
    return res;
  }

  console.log(wishlistItemsData);
  for (let i = 0; i < wishlistItemsData.length; i++) {
    const course = await getCourseById(wishlistItemsData[i].courseId);
    res.wishlistItems.push({ ...wishlistItemsData[i], course });
  }

  return res;
}

export async function createWishlist(studentId: string) {
  const { data, error } = await supabase
    .from("wishlists")
    .insert({
      studentId,
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  } else
    return {
      ...data,
      userHasWishlist: true,
      wishlistItems: [],
    };
}

export async function addCourseToWishlist(
  courseId: string,
  studentId: string,
  wishlistId: string
) {
  const { data: wishlistItem, error } = await supabase
    .from("wishlistItems")
    .insert({
      studentId,
      courseId,
      wishlistId,
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const courseData = await getCourseById(courseId);

  return {
    ...wishlistItem,
    course: courseData,
  };
}

export async function deleteWishlistItem(id: string) {
  const { error } = await supabase.from("wishlistItems").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function deleteWishlist(
  wishlistId: string,
  wishlistItems: WishlistItem[]
) {
  for (let i = 0; i < wishlistItems.length; i++) {
    const { error } = await supabase
      .from("wishlistItems")
      .delete()
      .eq("id", wishlistItems[i].id);

    if (error) {
      throw new Error(error.message);
    }
  }

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("id", wishlistId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
