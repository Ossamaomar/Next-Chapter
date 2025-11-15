"use client";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { getUserData } from "@/store/authSlice";

export default function UserCurrentState() {
  const userData = useSelector(getUserData);

  return (
    <div className="hidden md:block">
      {userData?.email ? (
        <UserMenu />
      ) : (
        <Link href={"/auth/login"}>
          <Button
            variant={"default"}
            size={"lg"}
            className="transition duration-300 border-2 border-black hover:bg-white hover:text-black"
          >
            Login
          </Button>
        </Link>
      )}
    </div>
  );
}
