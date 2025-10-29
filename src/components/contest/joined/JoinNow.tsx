'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

const JoinNow = () => {
  const data = {
    title: 'YOUR MAGAZINE SHOT',
    description: 'Fresh challenge just unveiled',
    img: 'https://img.freepik.com/free-vector/stylish-glowing-digital-red-lines-banner_1017-23964.jpg?semt=ais_hybrid&w=740&q=80',
    link: '/contest/open',
  };

  return (
    <section
      className="border-black-2-500 my-10 rounded-xl border-2 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${data?.img})`,
      }}
    >
      <div className="text-foreground flex flex-col items-center justify-center gap-8 rounded-xl bg-black/50 p-10">
        <h1 className="text-5xl font-bold uppercase">{data?.title}</h1>
        <p className="text-xl">{data?.description}</p>
        <Link
          href={data?.link}
          className="bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 rounded-sm px-5 py-2 font-medium transition"
        >
          Join Now <FaArrowRightLong />
        </Link>
      </div>
    </section>
  );
};

export default JoinNow;
