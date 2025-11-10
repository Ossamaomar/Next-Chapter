"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { getInstructorInfo, getUserByEmail, login } from "@/app/_services/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { LoginSession, User, userSignin } from "@/app/_services/types";
import { checkUserHasCart } from "@/app/_services/cart";
import { createCartSlice } from "@/store/cartSlice";
import { getEnrolledCourses } from "@/app/_services/enrollments";
import { setEnrollments } from "@/store/enrollmentsSlice";
import SubmitAuthForm from "@/app/_components/auth/register/SubmitAuthForm";
import InputField from "../../forms/InputField";
import { checkUserHasWishlist } from "@/app/_services/wishlist";
import { createWishlistSlice } from "@/store/wishlistSlice";


const FormSchema = z.object({
  email: z.string().email("Email must be like name@example.com"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function LoginContainer() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {

    setIsLoading(true);
    try {
      const res = await login(data as userSignin);
      const user: User = await getUserByEmail(res?.user?.email);
      const userCart = await checkUserHasCart(user.id, user.role);
      const userWishlist = await checkUserHasWishlist(user.id, user.role);
      await setAuthCookies(res, user);
      dispatch(
        loginUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
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
      router.refresh();
    } catch (error) {
      toast.error("Invalid login credentials");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function setAuthCookies(loginSession: LoginSession, user: User) {
    const cookieResponse = await fetch("/api/auth/set-cookies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: loginSession.session.access_token,
        role: user.role,
        userId: user.id,
      }),
      credentials: "include", // Important for cookies
    });

    if (!cookieResponse.ok) {
      toast.error("Failed to set authentication cookies");
      throw new Error("Failed to set authentication cookies");
    }
  }

//   async function fetchUserData(email: string) {
//     const res = await getUserByEmail(email);
//     dispatch(
//       loginUser({
//         id: res.id,
//         email: res.email,
//         name: res.name,
//         role: res.role,
//       })
//     );

//     return res;
//   }

  return (
    <div className="flex-1 py-10 flex items-center justify-center bg-gradient-to-r from-amber-100 to-emerald-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[600px] rounded-lg space-y-6 py-20 border px-8 border-gray-400 bg-white"
        >
          <InputField
            control={form.control}
            name="email"
            label="Email"
            placeholder="name@example.com"
            type="email"
          />

          <InputField
            control={form.control}
            name="password"
            label="Password"
            placeholder="password"
            type="password"
          />
          <SubmitAuthForm isLoading={isLoading} type="login" />
        </form>
      </Form>
    </div>
  );
}
