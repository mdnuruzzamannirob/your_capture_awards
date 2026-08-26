'use client';

import { FeatureItems } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdArrowForward } from 'react-icons/io';

const Features = () => {
  const { isAuthenticated } = useAuth();
  const contestHref = '/contest/open';
  const featureHref = isAuthenticated
    ? contestHref
    : `/signin?returnTo=${encodeURIComponent(contestHref)}`;

  return (
    <section className="container my-20 py-20">
      {/* titles */}
      <h3 className="mx-auto w-full text-center text-3xl font-medium lg:max-w-3xl lg:text-4xl">
        Key Features Of Your Capture Awards
      </h3>
      <p className="mx-auto mt-5 w-full text-center text-lg lg:max-w-xl">
        We are constantly working to bring new updates and features to Upload, such as:
      </p>

      <div className="mx-auto my-10 grid w-full max-w-4xl grid-cols-1 justify-items-center gap-5 md:grid-cols-2">
        {FeatureItems.map((item, index) => (
          <Link
            href={featureHref}
            key={index}
            className="border-primary bg-background hover:bg-surface-secondary focus-visible:ring-primary flex min-h-86 w-full max-w-101 flex-col items-center justify-center gap-5 rounded-xl border p-5 text-center transition focus-visible:ring-2 focus-visible:outline-none"
          >
            <Image
              alt={item.title}
              src={item.img}
              width={200}
              height={150}
              className="h-34 w-full max-w-50 rounded-xl object-cover"
            />
            <h3 className="text-2xl font-medium">{item.title}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <h3 className="text-2xl font-medium">And so much more...</h3>
        <p className="max-w-md">
          Earn achievements, read reviews, explore custom recommendations, and more.
        </p>
        <Link
          href={'/contest/open'}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center rounded-sm px-5 py-2"
        >
          Explore Contest <IoMdArrowForward />
        </Link>
      </div>
    </section>
  );
};

export default Features;
