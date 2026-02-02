import Image from 'next/image';
import { FaArrowDown } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';

const Banner = () => {
  return (
    <section className="flex min-h-dvh items-center">
      <div className="relative container flex flex-col-reverse items-center justify-between gap-20 py-28 lg:flex-row lg:gap-10">
        {/* Left content */}
        <div className="flex-1 space-y-6">
          {/* Award logo */}
          <div className="flex items-center gap-5">
            <Image alt="Award" src="/icons/award.png" width={90} height={90} />

            <p className="from-primary to-foreground bg-linear-to-b bg-clip-text font-bold text-transparent">
              THE <br /> GAME <br /> AWARD
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-5xl leading-normal font-bold">
            Play, Improve & <br /> Win.
          </h1>

          {/* Subtext */}
          <p className="max-w-md">
            Your Capture awards the ultimate destination for photographers, discussing, and creating
            stunning imagery.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            <div className="text-lg font-medium">
              <p className="text-primary relative w-16">
                Online
                <span className="text-foreground absolute top-0 -right-1.5">
                  <GoDotFill />
                </span>
              </p>
              <p>16,985,304</p>
            </div>
            <div className="text-lg font-medium">
              <p className="text-primary relative w-28">
                Playing Now
                <span className="text-foreground absolute top-0 -right-2">
                  <GoDotFill />
                </span>
              </p>
              <p>16,985,304</p>
            </div>
          </div>

          {/* Button */}
          <button className="border-primary hover:border-primary/90 hover:text-foreground/90 flex items-center gap-2 rounded-sm border px-5 py-2 font-medium transition-colors">
            Learn More
            <FaArrowDown className="size-4" />
          </button>
        </div>

        {/* Right content */}
        <div className="relative flex flex-1 justify-center">
          <Image
            src="/images/person.png"
            alt="Photographer holding camera"
            width={600}
            height={600}
            className="h-auto object-cover"
          />
        </div>

        {/* Background vectors */}
        <Image
          alt=""
          src="/icons/badge.png"
          width={24}
          height={24}
          className="absolute top-28 right-10 opacity-30 sm:right-28"
        />
        <Image
          alt=""
          src="/icons/camera.png"
          width={50}
          height={50}
          className="absolute bottom-0 left-10"
        />
        <Image
          alt=""
          src="/icons/capture.png"
          width={50}
          height={50}
          className="absolute top-2/3 right-10 opacity-30 lg:right-0 lg:left-2/5"
        />
        <Image
          alt=""
          src="/icons/linked-camera.png"
          width={100}
          height={100}
          className="absolute right-32 -bottom-10 -translate-x-1/5 opacity-60"
        />
      </div>
    </section>
  );
};

export default Banner;
