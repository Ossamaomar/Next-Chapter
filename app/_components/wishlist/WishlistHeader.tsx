"use client";

import { useGSAP } from "@gsap/react";
import Header from "../ui/Header";
import { useRef } from "react";
import gsap from "gsap";

export default function WishlistHeader() {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(container.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.3,
    });
  });
  return (
    <div ref={container}>
      <Header>My Wishlist</Header>
    </div>
  );
}
