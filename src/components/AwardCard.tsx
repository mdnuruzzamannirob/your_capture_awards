import { cn } from '@/utils/cn';
import Image from 'next/image';

const AwardCard = ({
  title,
  keys = 0,
  swap = 0,
  boost = 0,
}: {
  title: 'top-photographer' | 'top-photo' | 'yc-top-pick';
  swap?: number;
  boost?: number;
  keys?: number;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      {title === 'top-photographer' ? (
        <h3 className="text-center text-2xl font-semibold uppercase">
          Top <span className="text-primary">PHOTOGRAPHER</span> Award
        </h3>
      ) : title === 'top-photo' ? (
        <h3 className="text-center text-2xl font-semibold uppercase">
          Top <span className="text-primary">PHOTO</span> Award
        </h3>
      ) : (
        <h3 className="text-center text-2xl font-semibold uppercase">
          <span className="text-primary">YC</span> Top Pick{' '}
          <span className="text-primary">Award</span>
        </h3>
      )}

      <div
        className={cn(
          'flex items-center justify-between gap-10 overflow-hidden',
          title === 'top-photo' ? 'flex-col lg:flex-row-reverse' : 'flex-col lg:flex-row',
        )}
      >
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 text-center text-balance">
          <Image alt="" src={`/icons/${title}.png`} width={60} height={50} />
          <h3 className="text-xl font-semibold">Your Capture Awards Bundle</h3>
          <p>
            Congratulations on winning the Your Capture Award! Your exceptional photography skills
            have earned you well-deserved recognition. Keep up the great work.
          </p>
        </div>

        <div className="h-60 w-fit pt-1 max-sm:scale-70 sm:px-7">
          <div className="relative flex w-fit items-center">
            <div className="bg-foreground text-background flex h-32 w-28 translate-x-5 translate-y-3 -rotate-12 flex-col items-center justify-center rounded border shadow-md sm:h-36 sm:w-32">
              <Image alt="" src="/icons/swap.png" width={50} height={50} />
              <h4 className="mt-1 text-lg font-extrabold">x{swap}</h4>
              <h3 className="text-muted-foreground font-semibold">Swap</h3>
            </div>
            <div className="bg-foreground text-background z-10 flex h-32 w-28 flex-col items-center justify-center rounded border shadow-md sm:h-36 sm:w-32">
              <Image alt="" src="/icons/vote.png" width={50} height={50} />
              <h4 className="mt-1 text-lg font-extrabold">x{boost}</h4>
              <h3 className="text-muted-foreground font-semibold">Boost</h3>
            </div>
            <div className="bg-foreground text-background flex h-32 w-28 -translate-x-5 translate-y-3 rotate-12 flex-col items-center justify-center rounded border shadow-md sm:h-36 sm:w-32">
              <Image alt="" src="/icons/key.png" width={50} height={50} />
              <h4 className="mt-1 text-lg font-extrabold">x{keys}</h4>
              <h3 className="text-muted-foreground font-semibold">Keys</h3>
            </div>

            <Image
              alt=""
              src="/icons/award-part1.png"
              width={385}
              height={100}
              className="absolute -bottom-[70px] z-10"
            />
            <Image
              alt=""
              src="/icons/logo-name.png"
              width={340}
              height={100}
              className="absolute -bottom-[50px] left-1/2 z-10 -translate-x-1/2"
            />
            <Image
              alt=""
              src="/icons/award-part3.png"
              width={70}
              height={150}
              className="absolute -bottom-[88px] -left-6"
            />
            <Image
              alt=""
              src="/icons/award-part2.png"
              width={70}
              height={150}
              className="absolute -right-7 -bottom-[88px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardCard;
