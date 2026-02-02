'use client';

import Image from 'next/image';
import { FaPlus, FaFacebookF } from 'react-icons/fa';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';
import { MdOutlineCameraswitch } from 'react-icons/md';
import { Gift } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';

const WinnersTab = ({ contest, value }: { contest: any; value: string }) => {
  return (
    <TabsContent value={value} className="mx-auto w-full max-w-4xl space-y-10">
      <div className="border-black-2-600 relative w-full space-y-5 rounded-xl border-2 p-5">
        <div className="flex items-center justify-center gap-5">
          <div className="size-16 rounded-2xl bg-white/10"></div>
          <h1 className="text-4xl font-bold uppercase">TOP PHOTOGRAPHER WINNER</h1>
        </div>
        <div className="grid h-112.5 grid-cols-5 grid-rows-4 gap-5">
          <div className="col-span-4 row-span-4 rounded-xl bg-white/10"></div>
          <div className="rounded-xl bg-white/10"></div>
          <div className="rounded-xl bg-white/10"></div>
          <div className="rounded-xl bg-white/10"></div>
          <div className="rounded-xl bg-white/10"></div>
        </div>

        <div className="flex justify-between gap-5 pl-5">
          <div className="border-foreground bg-primary -mt-16 size-32 min-w-32 rounded-full border-4">
            <Image
              alt="Profile"
              src="/images/person.png"
              width={150}
              height={150}
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-xl font-semibold whitespace-nowrap">
                {'Md. Nuruzzaman'}
              </h3>
              <p className="">{'Bangladesh'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-foreground flex items-center justify-center gap-1.5 rounded bg-blue-500 px-4 py-1.5 text-sm">
                Follow <FaPlus />
              </button>
              <button className="flex size-8 items-center justify-center rounded border border-blue-500 text-blue-500">
                <FaFacebookF />
              </button>
            </div>
            <div className="text-primary bg-primary/10 bun dev flex items-center gap-2 rounded p-1.5 text-sm">
              <Gift />
              <p className="flex items-center gap-1">
                <MdOutlineCameraswitch className="rotate-90" />
                x20
              </p>
              |
              <p className="flex items-center gap-1">
                <AiOutlineThunderbolt /> x20
              </p>
              |
              <p className="flex items-center gap-1">
                <IoKeyOutline /> x20
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-black-2-600 relative space-y-5 rounded-xl border-2 p-5">
        <div className="flex items-center justify-center gap-5">
          <div className="size-16 rounded-3xl bg-white/10"></div>
          <h1 className="text-4xl font-bold uppercase">TOP PHOTO WINNER</h1>
        </div>
        <div className="h-112.5 rounded-xl bg-white/10"></div>
        <div className="flex justify-between gap-5 pl-5">
          <div className="border-foreground bg-primary -mt-16 size-32 min-w-32 rounded-full border-4">
            <Image
              alt="Profile"
              src="/images/person.png"
              width={150}
              height={150}
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-xl font-semibold whitespace-nowrap">
                {'Md. Nuruzzaman'}
              </h3>
              <p className="">{'Bangladesh'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-foreground flex items-center justify-center gap-1.5 rounded bg-blue-500 px-4 py-1.5 text-sm">
                Follow <FaPlus />
              </button>
              <button className="flex size-8 items-center justify-center rounded border border-blue-500 text-blue-500">
                <FaFacebookF />
              </button>
            </div>
            <div className="text-primary bg-primary/10 bun dev flex items-center gap-2 rounded p-1.5 text-sm">
              <Gift />
              <p className="flex items-center gap-1">
                <MdOutlineCameraswitch className="rotate-90" />
                x20
              </p>
              |
              <p className="flex items-center gap-1">
                <AiOutlineThunderbolt /> x20
              </p>
              |
              <p className="flex items-center gap-1">
                <IoKeyOutline /> x20
              </p>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default WinnersTab;
