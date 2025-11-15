"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/_lib/supabase";
import {
  getInstructorInfo,
  getUserByEmail,
  setAuthCookies,
} from "@/app/_services/auth";
import { User } from "@/app/_services/types";
import { checkUserHasCart } from "@/app/_services/cart";
import { checkUserHasWishlist } from "@/app/_services/wishlist";
import { loginUser } from "@/store/authSlice";
import { getEnrolledCourses } from "@/app/_services/enrollments";
import { setEnrollments } from "@/store/enrollmentsSlice";
import { createCartSlice } from "@/store/cartSlice";
import { createWishlistSlice } from "@/store/wishlistSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase automatically processes the URL fragment and stores the session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        return;
      }

      if (data.session) {
        const user: User = await getUserByEmail(data.session.user.email);
        if (!user?.id) {
          router.push("/auth/completeProfile");
        } else {
          const userCart = await checkUserHasCart(user.id, user.role);
          const userWishlist = await checkUserHasWishlist(user.id, user.role);
          await setAuthCookies(data.session, user);
          dispatch(
            loginUser({
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              personalPictureUrl: user.personalPictureUrl,
            })
          );

          if (user.role === "Student") {
            const enrollments = await getEnrolledCourses(user.id);
            dispatch(setEnrollments(enrollments));
          }

          if (user.role === "Student" && userCart.hasCart) {
            dispatch(
              createCartSlice({
                id: userCart.cart.id,
                studentId: userCart.cart.studentId,
                createdAt: userCart.cart.createdAt,
                userHasCart: true,
                cartItems: userCart.cartItems,
              })
            );
          }

          if (user.role === "Student" && userWishlist.hasWishlist) {
            dispatch(
              createWishlistSlice({
                id: userWishlist.wishlist.id,
                studentId: userWishlist.wishlist.studentId,
                createdAt: userWishlist.wishlist.createdAt,
                userHasWishlist: true,
                wishlistItems: userWishlist.wishlistItems,
              })
            );
          }

          if (user.role === "Instructor") {
            const instructorInfo = await getInstructorInfo(user.id);

            if (instructorInfo === null) {
              toast.info("Please complete your profile");
              router.push("/auth/register/completeProfile");
              return;
            }
          }
          toast.success("Welcome to your account");
          router.push("/");
        }
      } else {
        console.log("No session found");
      }
    };

    handleAuth();
  }, [router, dispatch]);

  return (
    <div className="flex items-center justify-center flex-1">
      <p className="text-lg font-medium">Signing you in...</p>
    </div>
  );
}
