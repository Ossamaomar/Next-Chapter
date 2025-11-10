import { getUserData } from "@/store/authSlice";
import {
  addCourseToCartSlice,
  createCartSlice,
  getCartState,
} from "@/store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { addCourseToCart, createCart } from "../_services/cart";

export function useAddToCart() {
  const { userHasCart } = useSelector(getCartState);
  const { id: studentId } = useSelector(getUserData);
  const { id: cartId } = useSelector(getCartState);
  const dispatch = useDispatch();

  async function handleAddToCart(courseId: string) {
    console.log(userHasCart);
    if (userHasCart) {
      const cartItem = await addCourseToCart(courseId, studentId, cartId);
      dispatch(addCourseToCartSlice(cartItem));
      console.log("User has cart");
    } else {
      const cart = await createCart(studentId);
      dispatch(createCartSlice(cart));
      const cartItem = await addCourseToCart(courseId, studentId, cart.id);
      dispatch(addCourseToCartSlice(cartItem));
      console.log("User doesn't has cart");
    }
  }

  return { userHasCart, handleAddToCart };
}
