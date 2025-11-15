"use server";

import { cookies, headers } from "next/headers";
import { getUserByEmail, login, logout } from "../_services/auth";
import { CartItem, userSignin } from "../_services/types";
import { stripe } from "./stripe";
import { signIn, signOut } from "./auth";

export async function loginAction({ email, password }: userSignin) {
  await login({ email, password });

  await getUserByEmail(email);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7200,
  });
}

export async function setRoleCookie(role: string) {
  const cookieStore = await cookies();
  cookieStore.set("role", role, {
    httpOnly: true, // secure from JS access
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function logoutAction() {
  await logout();
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("token");
}

export async function getRoleCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("roleAccess");
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("role");
}

export async function fetchClientSecret(items: CartItem[]) {
  const origin = (await headers()).get("origin");
  const line_items = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.course.title,
        images: [item.course.thumbnail_url],
      },
      unit_amount: item.course.price * 100,
    },
    quantity: 1,
  }));
  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: line_items,
    mode: "payment",
    return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return {
    client_secret: session.client_secret,
    session_id: session.id,
  };
}
