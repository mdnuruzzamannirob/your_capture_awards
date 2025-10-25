'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Memories() {
  const images = [
    {
      image: '/photographer.png',
    },
    {
      image: '/photographer.png',
    },
    {
      image: '/photographer.png',
    },
    {
      image: '/photographer.png',
    },
    {
      image: '/photographer.png',
    },
  ];
  return (
    <section className="relative container mt-24 space-y-10 pt-14 pb-40">
      {/* bg image */}
      <div className="absolute inset-0 -z-10 size-full opacity-15">
        <Image alt="background" src="/back-circle.png" fill />
      </div>

      {/* title */}
      <div className="mx-auto w-36 text-center">
        <h1 className="text-2xl font-medium">MEMORIES</h1>
        <div className="border-primary my-1 w-28 border-b" />
        <div className="flex items-center justify-end">
          <div className="w-28 border-b" />
        </div>
      </div>

      <h3 className="text-primary mx-auto w-full text-center text-3xl font-medium lg:max-w-lg lg:text-4xl">
        Guardian of cherished memories through time.{' '}
      </h3>

      <p className="mx-auto w-full text-center lg:max-w-lg">
        Presenting nearly 30,000 diverse captures, spanning natural, cultural, and
        everything-in-between imagery in our collection.
      </p>

      {/* Swiper */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="rounded-xl"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i} className="rounded-xl">
            <Image
              src={src.image}
              alt={`Memory ${i + 1}`}
              width={500}
              height={300}
              className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
