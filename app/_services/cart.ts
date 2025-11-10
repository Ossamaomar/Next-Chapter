import { supabase } from "../_lib/supabase";
import { getCourseById } from "./courses";
import { Cart, CartItem } from "./types";

export async function checkUserHasCart(id: string, role: string) {
  const res: { hasCart: boolean; cart: Cart; cartItems: CartItem[] } = {
    hasCart: false,
    cart: { id: "", createdAt: "", studentId: "" },
    cartItems: [],
  };

  if(role === "Instructor") return res;

  const { data: cartData, error: cartError } = await supabase
    .from("carts")
    .select("*")
    .eq("studentId", id)
    .maybeSingle();

  if (cartError) {
    console.error(cartError.message);
    return res;
  }

  if (!cartData) {
    return res
  }

  res.hasCart = true;
  res.cart = cartData;

  const { data: cartItemsData, error: cartItemsError } = await supabase
    .from("cartItems")
    .select("*")
    .eq("cartId", cartData.id);

  if (cartItemsError) {
    console.error("Error fetching user cart items");
    return res;
  }

  for (let i = 0; i < cartItemsData.length; i++) {
    const course = await getCourseById(cartItemsData[i].courseId);
    res.cartItems.push({ ...cartItemsData[i], course });
  }

  return res;
}

export async function createCart(studentId: string) {
  const { data, error } = await supabase
    .from("carts")
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
      userHasCart: true,
      cartItems: [],
    };
}

export async function addCourseToCart(
  courseId: string,
  studentId: string,
  cartId: string
) {
  const { data: cartItem, error } = await supabase
    .from("cartItems")
    .insert({
      studentId,
      courseId,
      cartId,
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const courseData = await getCourseById(courseId);

  return {
    ...cartItem,
    course: courseData,
  };
}

export async function deleteCart(cartId: string, cartItems: CartItem[]) {
  for (let i = 0; i < cartItems.length; i++) {
    const { error } = await supabase
      .from("cartItems")
      .delete()
      .eq("id", cartItems[i].id);

    if (error) {
      throw new Error(error.message);
    }
  }

  const { error } = await supabase.from("carts").delete().eq("id", cartId);

  if (error) {
    throw new Error(error.message);
  }

  return true
}

export async function deleteCartItem(id: string) {
  const { error } = await supabase.from("cartItems").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
