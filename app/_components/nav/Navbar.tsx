"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { Menu, X } from "lucide-react"; // icons for mobile menu
import Searchbar from "./Searchbar";
import { CourseResponse } from "@/app/_services/types";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getCartItems } from "@/store/cartSlice";
import UserCurrentState from "./UserCurrentState";
import { getWishlistItemsState } from "@/store/wishlistSlice";
import { getUserData } from "@/store/authSlice";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { categories } from "@/app/_lib/helpers";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [showResults, setShowResults] = useState(false);
  const cartItems = useSelector(getCartItems);
  const wishlistItems = useSelector(getWishlistItemsState);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const user = useSelector(getUserData);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If click is outside search wrapper → hide results
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <nav className="h-20 flex gap-4 justify-between items-center shadow-md px-6 relative">
        <div className="relative shrink-0">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Next Chapter logo"
              width={80}
              height={80}
              className="cursor-pointer"
            />
          </Link>
        </div>

        <div ref={wrapperRef} className="w-full relative">
          <Suspense>
            <Searchbar
              setCourses={setCourses}
              setShowResults={setShowResults}
            />
          </Suspense>
          {showResults && courses.length > 0 && (
            <div className="bg-gray-50 border-2 border-slate-300  mt-1 absolute w-full z-10 p-2 space-y-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => router.push(`/course`)}
                  className="relative flex items-center gap-2 p-2 h-16 w-full aspect-video hover:bg-slate-200 cursor-pointer"
                >
                  <div className="relative aspect-video w-20">
                    <Image fill src={course.thumbnail_url} alt={course.title} />
                  </div>
                  <div className="flex flex-col justify-between h-full">
                    <p className="font-bold">{course.title}</p>
                    <p className="text-sm font-mono">
                      {course.instructor_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-4">
          <Link
            href="/courses"
            className="hidden md:block hover:text-emerald-600"
          >
            Courses
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger className="text-md font-normal">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    <li>
                      {categories.map((cat) => (
                        <NavigationMenuLink key={cat} asChild>
                          <Link href={`/category/${cat}`}>
                            <div className="font-medium">{cat}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="relative hidden md:block">
            {wishlistItems.length > 0 && (
              <div className="absolute flex justify-center items-center text-white text-sm bg-emerald-600 w-5 h-5 rounded-full -top-2 -right-2">
                {wishlistItems.length}
              </div>
            )}
            <Link href="/wishlist" className=" hover:text-emerald-600  ">
              <FiHeart size={25} className="cursor-pointer " />
            </Link>
          </div>
          <div className="relative hidden md:block">
            {cartItems.length > 0 && (
              <div className="absolute flex justify-center items-center text-white text-sm bg-emerald-600 w-5 h-5 rounded-full -top-2 -right-2">
                {cartItems.length}
              </div>
            )}
            <Link href="/cart" className=" hover:text-emerald-600  ">
              <HiOutlineShoppingCart size={25} className="cursor-pointer " />
            </Link>
          </div>
          <UserCurrentState />
          <button
            className="md:hidden text-gray-700 z-50 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed z-40 top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-6 text-lg font-medium transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="hover:text-emerald-600"
        >
          Home
        </Link>
        {user.role === "Student" && (
          <Link
            href="/myLearning"
            onClick={() => setOpen(false)}
            className="hover:text-emerald-600"
          >
            My Learning
          </Link>
        )}

        <Link
          href="/courses"
          onClick={() => setOpen(false)}
          className="hover:text-emerald-600"
        >
          Courses
        </Link>
        <div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="block">
                <NavigationMenuTrigger className="text-md font-normal">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    <li>
                      {categories.map((cat) => (
                        <NavigationMenuLink key={cat} asChild>
                          <Link href={`/category/${cat}`}>
                            <div className="font-medium">{cat}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {user.role === "Instructor" && (
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="hover:text-emerald-600"
          >
            Profile
          </Link>
        )}

        {user.role === "Instructor" && (
          <Link
            href="/addCourse"
            onClick={() => setOpen(false)}
            className="hover:text-emerald-600"
          >
            Add Course
          </Link>
        )}

        {(user.role === "Instructor" || user.role === "Student") && (
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="hover:text-emerald-600"
          >
            Account
          </Link>
        )}

        {/* Mobile Icons */}
        <div className="flex gap-6 mt-6">
          <div className="relative">
            {wishlistItems.length > 0 && (
              <div className="absolute flex justify-center items-center text-white text-sm bg-emerald-600 w-5 h-5 rounded-full -top-2 -right-2">
                {wishlistItems.length}
              </div>
            )}
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className=" hover:text-emerald-600  "
            >
              <FiHeart size={25} className="cursor-pointer " />
            </Link>
          </div>
          <div className="relative">
            {cartItems.length > 0 && (
              <div className="absolute flex justify-center items-center text-white text-sm bg-emerald-600 w-5 h-5 rounded-full -top-2 -right-2">
                {cartItems.length}
              </div>
            )}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className=" hover:text-emerald-600  "
            >
              <HiOutlineShoppingCart size={25} className="cursor-pointer " />
            </Link>
          </div>
        </div>

        <div>
          <Link href={"/auth/login"}>
            <Button
              variant={"default"}
              size={"lg"}
              className="transition duration-300 border-2 border-black hover:bg-white hover:text-black"
              onClick={() => setOpen(false)}
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
