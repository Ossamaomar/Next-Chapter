import {
  configureStore,
  createAction,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import authSlice, { logoutUser } from "./authSlice";
import courseMetaSlice from "./courseMetaSlice";
import courseSectionsSlice from "./courseSectionsSlice";
import courseLecturesSlice from "./courseLecturesSlice";
import ratingSlice from "./ratingSlice";
import wishlistSlice, { createWishlistSlice } from "./wishlistSlice";
import appSlice from "./appSlice";
import enrollmentsSlice, { setEnrollments } from "./enrollmentsSlice";
import cartSlice, { createCartSlice } from "./cartSlice";
import { loginUser } from "./authSlice";
import { checkUserHasCart } from "@/app/_services/cart";
import { getEnrolledCourses } from "@/app/_services/enrollments";
import { setInitialized } from "./appSlice";
import { AuthState } from "@/app/_services/types";
import { checkAuthFromNextJS, getUserById } from "@/app/_services/auth";
import { checkUserHasWishlist } from "@/app/_services/wishlist";

// Create the middleware instance and methods
const listenerMiddleware = createListenerMiddleware();

// Create a specific action for initialization
const initializeApp = createAction("app/initialize");

listenerMiddleware.startListening({
  actionCreator: initializeApp,
  effect: async (action, listenerApi) => {
    try {
      // Check authentication via Next.js API route
      const authResult: AuthState = await checkAuthFromNextJS();

      if (authResult.authenticated && authResult.user.id) {
        const user = await getUserById(authResult.user.id);
        const userCart = await checkUserHasCart(
          authResult.user.id,
          authResult.user.role
        );
        const userWishlist = await checkUserHasWishlist(
          authResult.user.id,
          authResult.user.role
        );

        const enrollments = await getEnrolledCourses(authResult.user.id);

        // Update store with user data
        listenerApi.dispatch(
          loginUser({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            personalPictureUrl: user.personalPictureUrl,
          })
        );

        listenerApi.dispatch(setEnrollments(enrollments));

        if (userCart.hasCart) {
          listenerApi.dispatch(
            createCartSlice({
              id: userCart.cart.id,
              studentId: userCart.cart.studentId,
              createdAt: userCart.cart.createdAt,
              userHasCart: true,
              cartItems: userCart.cartItems,
            })
          );
        }

        if (userWishlist.hasWishlist) {
          listenerApi.dispatch(
            createWishlistSlice({
              id: userWishlist.wishlist.id,
              studentId: userWishlist.wishlist.studentId,
              createdAt: userWishlist.wishlist.createdAt,
              userHasWishlist: true,
              wishlistItems: userWishlist.wishlistItems,
            })
          );
        }
      } else {

        // Ensure user is logged out in store
        listenerApi.dispatch(logoutUser());
      }
    } catch (error) {
      console.error("Error restoring auth state:", error);
      // On error, ensure user is logged out
      listenerApi.dispatch(logoutUser());
    } finally {
      listenerApi.dispatch(setInitialized(true));
    }
  },
});
export const store = configureStore({
  reducer: {
    auth: authSlice,
    courseMeta: courseMetaSlice,
    courseSections: courseSectionsSlice,
    courseLectures: courseLecturesSlice,
    cart: cartSlice,
    enrollments: enrollmentsSlice,
    rating: ratingSlice,
    wishlist: wishlistSlice,
    app: appSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
store.dispatch({ type: "app/initialize" });
