import { Vote } from 'lucide-react';
import Image from 'next/image';

const TeamMatch = () => {
  return (
    <div className="">
      {/* Team Match Header */}
      <div>
        <h2 className="font-kumbh text-xl font-bold">Team Match</h2>
        <p className="mt-1 text-sm text-zinc-400">Find and join matches with your team</p>
      </div>

      {/* Team Match */}
      <div className="mt-5 h-full overflow-hidden">
        <div className="grid grid-cols-2 gap-6 rounded-md border p-4">
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="text-xl font-medium">Match is on!</h1>
            <p>05h:44m:45s</p>
          </div>

          <div className="relative flex min-h-28 flex-col items-center justify-center gap-3 overflow-hidden rounded-md bg-gray-800 p-4">
            <h1 className="text-center font-medium text-white">Beauty in Nature</h1>
            <button className="rounded-sm bg-white px-3 py-1.5 text-xs font-medium text-black">
              Join Match
            </button>

            {/* Corner ribbon */}
            <div
              className="absolute top-0 right-0 size-14 bg-black"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
            >
              <div className="absolute top-0 -right-1 w-10 rotate-45 text-center text-white">
                <p className="leading-none font-bold">4</p>
                <p className="mt-0.5 text-[8px] tracking-wide">PHOTOS</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-md border p-4">
          <div className="flex border-b pb-5">
            {/* team 1 */}
            <div className="flex-1">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="size-24 rounded-full bg-gray-600"></div>
                <div className="-mt-10 flex items-center justify-center gap-1 rounded-full bg-gray-800 px-4 py-1 text-lg font-semibold">
                  555 <Vote />
                </div>
                <h1 className="text-lg font-semibold">Team 1</h1>
              </div>
            </div>

            {/* vs */}
            <div className="relative border-r">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">VS</span>
              </div>
            </div>

            {/* team 2 */}
            <div className="flex-1">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="size-24 rounded-full bg-gray-600"></div>
                <div className="-mt-10 flex items-center justify-center gap-1 rounded-full bg-gray-800 px-4 py-1 text-lg font-semibold">
                  5670 <Vote />
                </div>
                <h1 className="text-lg font-semibold">Team 2</h1>
              </div>
            </div>
          </div>

          {/*  */}
          <div className="flex gap-3 pt-4">
            <div className="h-75 flex-1 scrollbar-none space-y-2 overflow-y-auto">
              {[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}].map((photo, index) => (
                <div
                  key={index}
                  className="bg-primary/10 flex items-center justify-between gap-2 rounded-md p-3"
                >
                  <div className="flex items-center gap-2">
                    <p>{index + 1}</p>
                    <Image
                      width={32}
                      height={32}
                      src="https://picsum.photos/32/32"
                      alt="Match photo"
                      className="size-10 shrink-0 rounded-full object-cover"
                    />
                    <h1>John Doe</h1>
                  </div>
                  <div className="flex items-center justify-center gap-1 rounded-full bg-gray-800 px-4 py-1 font-semibold">
                    555 <Vote />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-r"></div>
            <div className="h-75 flex-1 scrollbar-none space-y-2 overflow-y-auto">
              {[{}, {}, {}].map((photo, index) => (
                <div
                  key={index}
                  className="bg-primary/10 flex items-center justify-between gap-2 rounded-md p-3"
                >
                  <div className="flex items-center gap-2">
                    <p>{index + 1}</p>
                    <Image
                      width={32}
                      height={32}
                      src="https://picsum.photos/32/32"
                      alt="Match photo"
                      className="size-10 shrink-0 rounded-full object-cover"
                    />
                    <h1>John Doe</h1>
                  </div>
                  <div className="flex items-center justify-center gap-1 rounded-full bg-gray-800 px-4 py-1 font-semibold">
                    555 <Vote />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Match  List */}
      {/* <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((match) => (
          <div key={match} className="border-black-2-700 bg-black-2-800/50 rounded-md border p-5">
            <p className="font-semibold">Challenge #{match}</p>
            <p className="mt-1 text-sm text-zinc-400">Description of the challenge goes here.</p>
            <button className="bg-primary mt-4 rounded-md px-4 py-2 text-sm font-medium text-white">
              Join Match
            </button>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default TeamMatch;
