'use client';

import { discoverItems } from '@/constants';
import Image from 'next/image';
import { useState } from 'react';

const Discover = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="relative container my-20 flex min-h-screen flex-col items-center justify-center py-16">
      {/* background image */}
      <div className="absolute inset-0 -z-10 size-full opacity-50">
        <Image alt="background" src="/skills.png" fill className="object-cover" />
      </div>

      {/* titles */}
      <h3 className="mx-auto w-full text-center text-3xl font-medium lg:max-w-3xl lg:text-4xl">
        Discover incredible insights, strengthen skills.
      </h3>

      <p className="mx-auto mt-5 w-full text-center text-lg lg:max-w-xl">
        Explore insights, bolster skills. Elevate your expertise with newfound knowledge and refined
        abilities.
      </p>

      {/* items */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
        {discoverItems?.map((item) => (
          <div key={item.key} className="flex size-48 items-center justify-center">
            <div
              onMouseEnter={() => setHovered(item.key)}
              onMouseLeave={() => setHovered(null)}
              className="border-primary rounded-full border p-2 transition-all duration-300"
            >
              <div className="bg-primary text-background relative flex size-36 flex-col items-center justify-center rounded-full font-bold transition-all duration-300 hover:size-44">
                <Image
                  src={item.img}
                  alt={item.label}
                  width={56}
                  height={56}
                  className="h-14 w-auto transition-transform duration-300"
                />
                <p className="mt-1 uppercase">{item.label}</p>
                {hovered === item.key && item.sub && (
                  <p className="animate-fadeIn text-background mt-1 px-5 text-center text-[10px] font-normal normal-case">
                    {item.sub}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Discover;
