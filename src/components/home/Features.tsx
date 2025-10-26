import { FeatureItems } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdArrowForward } from 'react-icons/io';

const Features = () => {
  return (
    <section className="container my-20 py-20">
      {/* titles */}
      <h3 className="mx-auto w-full text-center text-3xl font-medium lg:max-w-3xl lg:text-4xl">
        Key Features Of Your Capture Awards
      </h3>
      <p className="mx-auto mt-5 w-full text-center text-lg lg:max-w-xl">
        We are constantly working to bring new updates and features to Upload, such as:
      </p>

      <div className="my-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FeatureItems.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className="border-primary flex flex-col items-center justify-center gap-5 rounded-xl border p-5 text-center"
          >
            <Image
              alt={item.title}
              src={item.img}
              width={200}
              height={150}
              className="h-auto rounded-xl"
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
        <button className="bg-primary text-background hover:bg-primary/90 flex items-center justify-center rounded-sm px-5 py-2">
          Upload Image <IoMdArrowForward />
        </button>
      </div>
    </section>
  );
};

export default Features;
