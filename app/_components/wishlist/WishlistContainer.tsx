"use client";

import { useRef } from "react";
import WishlistRow from "./WishlistRow";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function WishlistContainer() {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(
      container.current,
      { filter: "blur(10px)", opacity: 0 },
      {
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.5,
        delay: 1,
        ease: "power2.out",
      }
    );
  });
  return (
    <div ref={container} className="w-full px-8 py-6">
      <WishlistRow />
    </div>
  );
}
