"use client";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";

import { Category as CategoryType } from "@/app/_services/types";
import Category from "./Category";

export function DraggableCategories({
  categories,
}: {
  categories: CategoryType[];
}) {

  return (
    <Swiper
      spaceBetween={50}
      breakpoints={{
        0: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className=" sm:[w-300px] md:w-[600px] lg:w-[900px] h-80  mx-auto px-20! "
      freeMode={true}
      autoplay={true}
      mousewheel={true}
      modules={[FreeMode, Autoplay, Mousewheel]}
    >
      {categories.map((cat) => (
        <SwiperSlide key={cat.id} className="flex! justify-center! items-center!">
          <Category category={cat} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
