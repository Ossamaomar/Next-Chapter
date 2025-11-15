"use client";

import { useGSAP } from "@gsap/react";
import { FaGraduationCap, FaLightbulb, FaPuzzlePiece } from "react-icons/fa6";
import { GiNotebook, GiWhiteBook } from "react-icons/gi";
import { LuBrainCircuit } from "react-icons/lu";
import { TbTargetArrow } from "react-icons/tb";
import gsap from "gsap";
import { useEffect, useState } from "react";

export default function BackgroundIcons() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useGSAP(() => {
    // Set initial states immediately
    gsap.set(".left-half", {
      top: "50%",
      left: "50%",
      opacity: 0,
    });

    gsap.set(".right-half", {
      top: "50%",
      right: "50%",
      opacity: 0,
    });

    gsap.set(".anim", {
      bottom: "50%",
      opacity: 0,
    });

    // Animate left-half icons
    gsap.to(".left-half", {
      top: (i, target) => isMobile ? target.dataset.topMobile : target.dataset.top,
      left: (i, target) => isMobile ? target.dataset.leftMobile : target.dataset.left,
      opacity: 1,
      duration: 1,
      onComplete: () => {
        gsap.to(".left-half", {
          scale: 1.2,
          duration: 0.7,
          repeat: -1,
          yoyo: true,
        });
      },
    });

    // Animate right-half icons
    gsap.to(".right-half", {
      top: (i, target) => isMobile ? target.dataset.topMobile : target.dataset.top,
      right: (i, target) => isMobile ? target.dataset.rightMobile : target.dataset.right,
      opacity: 1,
      duration: 1,
      onComplete: () => {
        gsap.to(".right-half", {
          scale: 1.3,
          duration: 0.7,
          repeat: -1,
          yoyo: true,
        });
      },
    });

    // Animate bottom icon
    gsap.to(".anim", {
      bottom: (i, target) => isMobile ? target.dataset.bottomMobile : target.dataset.bottom,
      opacity: 1,
      duration: 1,
      onComplete: () => {
        gsap.to(".anim", {
          opacity: 0.1,
          duration: 1,
          yoyo: true,
          repeat: -1,
        });
      },
    });
  }, { dependencies: [isMobile] }); // Re-run when isMobile changes

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none">
      <div>
        <TbTargetArrow
          className="left-half opacity-0 absolute text-emerald-400"
          data-top="10%"
          data-left="30%"
          data-top-mobile="5%"
          data-left-mobile="20%"
          size={isMobile ? 20 : 30}
        />
        <LuBrainCircuit
          className="left-half opacity-0 absolute text-emerald-400"
          data-top="30%"
          data-left="10%"
          data-top-mobile="30%"
          data-left-mobile="2%"
          size={isMobile ? 30 : 45}
        />
        <FaGraduationCap
          className="left-half opacity-0 absolute text-emerald-400"
          data-top="70%"
          data-left="20%"
          data-top-mobile="70%"
          data-left-mobile="10%"
          size={isMobile ? 20 : 30}
        />
      </div>
      <div>
        <FaPuzzlePiece
          className="right-half opacity-0 absolute text-amber-400/40"
          data-top="10%"
          data-right="30%"
          data-top-mobile="5%"
          data-right-mobile="20%"
          size={isMobile ? 25 : 35}
        />
        <GiNotebook
          className="right-half opacity-0 absolute text-amber-400/40"
          data-top="30%"
          data-right="10%"
          data-top-mobile="30%"
          data-right-mobile="2%"
          size={isMobile ? 20 : 30}
        />
        <GiWhiteBook
          className="right-half opacity-0 absolute text-amber-400/40"
          data-top="70%"
          data-right="20%"
          data-top-mobile="70%"
          data-right-mobile="10%"
          size={isMobile ? 30 : 45}
        />
      </div>
      <FaLightbulb
        className="anim opacity-0 left-[50%] transform translate-x-[-50%] absolute text-yellow-600/70"
        data-bottom="0"
        data-bottom-mobile="5%"
        size={isMobile ? 40 : 60}
      />
    </div>
  );
}