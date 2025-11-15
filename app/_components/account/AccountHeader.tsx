"use client";

import { useGSAP } from "@gsap/react";
import Header from "../ui/Header";
import gsap from "gsap";
import { useRef } from "react";

export default function AccountHeader() {
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
      <Header>My Account</Header>
    </div>
  );
}
