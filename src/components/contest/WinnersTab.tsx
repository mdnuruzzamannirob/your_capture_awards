'use client';

import { TabsContent } from '../ui/tabs';

const WinnersTab = ({ contest, value }: { contest: any; value: string }) => {
  return (
    <TabsContent value={value} className="space-y-10">
      <div className="border-black-2-600 relative space-y-10 rounded-xl border-2 p-10">
        <div className="flex items-center justify-center gap-5">
          <div className="size-16 border"></div>
          <h1 className="text-4xl font-bold uppercase">TOP PHOTOGRAPHER WINNER</h1>
        </div>
        <div className="grid h-[700px] grid-cols-4 grid-rows-4 gap-5">
          <div className="col-span-3 row-span-4 rounded-xl border"></div>
          <div className="rounded-xl border"></div>
          <div className="rounded-xl border"></div>
          <div className="rounded-xl border"></div>
          <div className="rounded-xl border"></div>
        </div>
        <div className="">
          <div className="z-50 -mt-20 size-28 min-w-28 rounded-full border bg-white"></div>
        </div>
      </div>
      <div className="border-black-2-600 relative space-y-10 rounded-xl border-2 p-10">
        <div className="flex items-center justify-center gap-5">
          <div className="size-16 border"></div>
          <h1 className="text-4xl font-bold uppercase">TOP PHOTO WINNER</h1>
        </div>
        <div className="grid h-[700px] grid-cols-4 grid-rows-4 gap-5">
          <div className="col-span-3 row-span-4 rounded-xl border"></div>
          <div className="rounded-xl border"></div>
          <div className="rounded-xl border"></div>
          <div className="rounded-xl border"></div>
          <div className="rounded-xl border"></div>
        </div>
        <div className="">
          <div className="z-50 -mt-20 size-28 min-w-28 rounded-full border bg-white"></div>
        </div>
      </div>
    </TabsContent>
  );
};

export default WinnersTab;
