"use client";

import { logout } from "@/app/_services/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserData, logoutUser } from "@/store/authSlice";
import { clearCartSlice } from "@/store/cartSlice";
import { clearEnrollmentSlice } from "@/store/enrollmentsSlice";
import { clearWishlistSlice } from "@/store/wishlistSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

export default function UserMenu() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { name, role, email } = useSelector(getUserData);

  async function handleLogout() {
    await logout();
    dispatch(logoutUser());
    dispatch(clearWishlistSlice());
    dispatch(clearCartSlice());
    dispatch(clearEnrollmentSlice());
    dispatch(clearWishlistSlice());
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="bg-gray-200 px-2 py-1 rounded-2xl border-2 border-emerald-500"
        asChild
      >
        {/* <Button variant="outline" className="border-2 border-black bg-gray-100"> */}
        <div className="flex gap-2 items-center cursor-pointer ">
          <BiUser /> {name.split(" ")[0]}
        </div>
        {/* </Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[18rem]" align="start">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex justify-center items-center text-xl font-semibold">{name.split(" ")[0][0]}{name.split(" ")[1][0]}</div>
            <div>
              <p className="text-emerald-600">{name}</p>
              <p className="text-gray-500 text-xs ">{email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {role === "Student" && (
            <DropdownMenuItem>
              <Link href={"/myLearning"}>My Learning</Link>
            </DropdownMenuItem>
          )}
          {role === "Student" && (
            <DropdownMenuItem>
              <Link href={"/cart"}>My Cart</Link>
            </DropdownMenuItem>
          )}
          {role === "Student" && (
            <DropdownMenuItem>
              <Link href={"/wishlist"}>My Wishlist</Link>
            </DropdownMenuItem>
          )}
          {role === "Instructor" && (
            <DropdownMenuItem>
              <Link href={"/profile"}>Profile</Link>
            </DropdownMenuItem>
          )}
          {role === "Instructor" && (
            <DropdownMenuItem>
              <Link href={"/addCourse"}>Add Course</Link>
            </DropdownMenuItem>
          )}
          {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="bg-red-500/90 border-2 border-red-500 transition duration-300 hover:bg-white"
          onClick={handleLogout}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
