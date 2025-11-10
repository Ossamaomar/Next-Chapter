// import { cookies } from "next/headers";
import UserCurrentState from "./UserCurrentState";
import { AuthState } from "@/app/_services/types";

export default async function UserStateServer() {
  const res = await fetch("/api/auth/check-token", {
    method: "GET",
    credentials: "include"
  });

  const data: AuthState = await res.json()
  return <UserCurrentState authState={data} />;
}
