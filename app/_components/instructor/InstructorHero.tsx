"use client";

import Image from "next/image";
import React, { useRef } from "react";

import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
  FaLink,
} from "react-icons/fa6";
import SocialLink from "./SocialLink";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const getSocialIcon = (url: string) => {
  const lower = url.toLowerCase();
  const size = 20;
  if (lower.includes("facebook.com"))
    return <FaFacebook size={size} className="text-blue-600" />;
  if (lower.includes("instagram.com"))
    return <FaInstagram size={size} className="text-pink-500" />;
  if (lower.includes("x.com") || lower.includes("twitter.com"))
    return <FaXTwitter size={size} className="text-black" />;
  if (lower.includes("linkedin.com"))
    return <FaLinkedin size={size} className="text-blue-700" />;
  if (lower.includes("youtube.com"))
    return <FaYoutube size={size} className="text-red-600" />;

  return <FaLink />; // default fallback icon
};

export default function InstructorHero({
  imgSrc,
  links,
}: {
  imgSrc: string;
  links: string[];
}) {
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
    <div
      ref={container}
      className="w-full bl mt-10 lg:mt-0 lg:w-[400px] bg-white lg:absolute lg:-translate-y-1/2 lg:z-50 lg:right-8 rounded-2xl shadow-2xl py-5 flex flex-col justify-center items-center"
    >
      <Image
        className="rounded-full"
        src={imgSrc}
        width={130}
        height={130}
        alt=""
      />
      <div className="flex gap-2 mt-4">
        {links.map((link, i) => (
          <SocialLink key={i} link={link}>
            {getSocialIcon(link)}
          </SocialLink>
        ))}
      </div>
    </div>
  );
}
