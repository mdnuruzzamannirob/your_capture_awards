'use client';

import Image from 'next/image';
import React from 'react';

const About = () => {
  return (
    <section className="container my-20 space-y-10 py-20">
      {/* title */}
      <div className="mx-auto w-36 text-center">
        <h1 className="text-2xl font-medium">ABOUT US</h1>
        <div className="border-primary my-1 w-28 border-b" />
        <div className="flex items-center justify-end">
          <div className="w-28 border-b" />
        </div>
      </div>

      <h3 className="text-primary mx-auto w-full text-center text-2xl font-medium lg:max-w-lg lg:text-4xl">
        Kimono captures All of Your beautiful memories{' '}
      </h3>

      <div className="flex flex-col gap-20 lg:flex-row">
        <div className="flex h-fit flex-col items-center gap-20 lg:flex-row">
          <Image
            src="/photographer.png"
            alt="photographer"
            width={312}
            height={312}
            className="size-80 object-cover"
          />
          <div className="space-y-5">
            <h3 className="text-2xl font-medium">
              A Photographic Journey Through Life&apos;s Beautiful Tapestry.
            </h3>
            <p className="mt-4 font-thin lg:w-[95%]">
              Embark on a captivating odyssey through life&apos;s intricate tapestry, where each
              snapshot immortalizes a moment of beauty and wonder. From sunrise vistas to candid
              smiles, this photographic journey unveils the richness and diversity of human
              experience.
            </p>
          </div>{' '}
        </div>

        <Image src="/studio.png" alt="studio" className="h-auto" width={400} height={500} />
      </div>
    </section>
  );
};

export default About;
