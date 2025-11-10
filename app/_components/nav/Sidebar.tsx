// import { getUserData } from "@/store/authSlice";
// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";

// export default function Sidebar() {
//   const [open, setOpen] = useState(false);
//     const wrapperRef = useRef<HTMLDivElement>(null);
//     const user = useSelector(getUserData);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       // If click is outside search wrapper → hide results
//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(event.target as Node)
//       ) {
//         setShowResults(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   return (
//     <div
//       className={`fixed z-40 top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-6 text-lg font-medium transform transition-transform duration-300 ease-in-out md:hidden ${
//         open ? "translate-x-0" : "-translate-x-full"
//       }`}
//     >
//       <Link
//         href="/"
//         onClick={() => setOpen(false)}
//         className="hover:text-cyan-600"
//       >
//         Home
//       </Link>
//       {user.role === "Student" && (
//         <Link
//           href="/myLearning"
//           onClick={() => setOpen(false)}
//           className="hover:text-cyan-600"
//         >
//           My Learning
//         </Link>
//       )}
//       {user.role === "Student" && (
//         <Link
//           href="/courses"
//           onClick={() => setOpen(false)}
//           className="hover:text-cyan-600"
//         >
//           Courses
//         </Link>
//       )}

//       {user.role === "Student" && (
//         <Link
//           href="/categories"
//           onClick={() => setOpen(false)}
//           className="hover:text-cyan-600"
//         >
//           Categories
//         </Link>
//       )}

//       {/* Mobile Icons */}
//       <div className="flex gap-6 mt-6">
//         <Link href="/wishlist" onClick={() => setOpen(false)}>
//           <FiHeart size={25} className="hover:text-cyan-600" />
//         </Link>
//         <div className="relative">
//           {cartItems.length > 0 && (
//             <div className="absolute flex justify-center items-center text-white text-sm bg-emerald-600 w-5 h-5 rounded-full -top-2 -right-2">
//               {cartItems.length}
//             </div>
//           )}
//           <Link href="/cart" className=" hover:text-cyan-600  ">
//             <HiOutlineShoppingCart size={25} className="cursor-pointer " />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
