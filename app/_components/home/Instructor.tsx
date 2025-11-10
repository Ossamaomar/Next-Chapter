import { merriweather } from "@/app/layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Instructor() {
  return (
    <div className="px-8 py-20 bg-gradient-to-r from-slate-700 to-slate-400 relative h-[420px] flex">
      <div className="hidden lg:block lg:absolute lg:left-0 lg:bottom-0">
        <Image
          src={"/instructor.png"} 
          width={700}
          height={200}
          alt="Instructor personal picture"
        />
      </div>

      <div className="relative lg:w-[70%] lg:ml-auto text-neutral-100">
        <p className={`text-5xl ${merriweather.className} `}>Become an instructor?</p>
        <p className="my-8 text-neutral-100">Join our instructors to be one of our experts who are from around the world.</p>
        <div className="flex items-center gap-2">
            <Button variant={'outline'} size={'sm'} className="bg-transparent"><Link href={"/auth/login"}>Join now</Link></Button>
            <Button variant={'default'} size={'sm'} className="">Our instructors</Button>
        </div>
      </div>
    </div>
  );
}
