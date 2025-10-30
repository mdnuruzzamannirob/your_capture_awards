'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
import { MdOutlineCameraswitch } from 'react-icons/md';
import Image from 'next/image';

export default function SwapBoostKeyModal() {
  const [activeTab, setActiveTab] = useState<'swap' | 'boost' | 'key'>('swap');
  const [open, setOpen] = useState(false);

  const openModal = (tab: 'swap' | 'boost' | 'key') => {
    setActiveTab(tab);
    setOpen(true);
  };

  return (
    <>
      {/* Buttons */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => openModal('swap')}
          className="text-primary bg-primary/10 flex items-center justify-center gap-3 rounded-sm p-2"
        >
          <span className="flex items-center gap-2">
            <span>
              <MdOutlineCameraswitch className="size-5 rotate-90" />
            </span>{' '}
            0
          </span>
          <span className="bg-primary text-foreground rounded p-1">
            <FaPlus />
          </span>
        </button>

        <button
          onClick={() => openModal('boost')}
          className="text-primary bg-primary/10 flex items-center justify-center gap-3 rounded-sm p-2"
        >
          <span className="flex items-center gap-2">
            <AiOutlineThunderbolt className="size-5" /> 0
          </span>
          <span className="bg-primary text-foreground rounded p-1">
            <FaPlus />
          </span>
        </button>
        <button
          onClick={() => openModal('key')}
          className="text-primary bg-primary/10 flex items-center justify-center gap-3 rounded-sm p-2"
        >
          <span className="flex items-center gap-2">
            <IoKeyOutline className="size-5" /> 0
          </span>
          <span className="bg-primary text-foreground rounded p-1">
            <FaPlus />
          </span>
        </button>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-black-2-600 bg-background text-foreground flex max-h-[70vh] flex-col overflow-hidden p-5 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold capitalize">{activeTab}</DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(value: any) => setActiveTab(value)}
            className="h-full"
          >
            <TabsList className="text-foreground w-full bg-white/5">
              <TabsTrigger
                value="swap"
                className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
              >
                <MdOutlineCameraswitch className="rotate-90" /> Swap
              </TabsTrigger>
              <TabsTrigger
                value="boost"
                className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
              >
                <AiOutlineThunderbolt /> Boost
              </TabsTrigger>
              <TabsTrigger
                value="key"
                className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
              >
                <IoKeyOutline /> Key
              </TabsTrigger>
            </TabsList>

            <TabsContent value="swap" className="flex flex-col lg:flex-row">
              <div className="flex flex-col items-center justify-center gap-3">
                <Image alt="" src="/images/swap-img.png" width={100} height={100} />
                <p>The Science of Swapping</p>
              </div>

              <div className="max-h-[50vh] flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2 p-1">
                  <p>
                    ... Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, voluptates
                    explicabo soluta veniam beatae pariatur accusamus at ipsa suscipit velit,
                    inventore quasi nam molestias, aliquam non illum illo fuga quidem.
                  </p>
                  <p>
                    ... Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed voluptate
                    nesciunt amet placeat aliquam, excepturi totam minima repellendus asperiores
                    magnam, ea deleniti rerum aliquid adipisci minus nemo, architecto quisquam.
                    Quis!
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis sapiente
                    repellendus dolor quas esse, dicta similique sint, est perferendis assumenda
                    numquam officia ad. Ipsum dolores vel nisi debitis optio sunt?
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="boost" className="flex">
              <div className="flex flex-col items-center justify-center gap-3">
                <Image alt="" src="/images/swap-img.png" width={100} height={100} />
                <p>The Science of Swapping</p>
              </div>
              <div className="grid flex-1 grid-cols-2">
                <p>
                  {' '}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae eligendi
                  laborum magnam et dolorem, eaque unde ex possimus sed dignissimos molestiae illum
                  quam expedita laboriosam. Dolores voluptatem veritatis vel tempora?
                </p>
                <p>
                  {' '}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae eligendi
                  laborum magnam et dolorem, eaque unde ex possimus sed dignissimos molestiae illum
                  quam expedita laboriosam. Dolores voluptatem veritatis vel tempora?
                </p>
                <p>
                  {' '}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae eligendi
                  laborum magnam et dolorem, eaque unde ex possimus sed dignissimos molestiae illum
                  quam expedita laboriosam. Dolores voluptatem veritatis vel tempora?
                </p>
              </div>
            </TabsContent>

            <TabsContent value="key" className="flex">
              <div className="flex flex-col items-center justify-center gap-3">
                <Image alt="" src="/images/swap-img.png" width={100} height={100} />
                <p>The Science of Swapping</p>
              </div>
              <div className="grid flex-1 grid-cols-2">
                <p>
                  {' '}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae eligendi
                  laborum magnam et dolorem, eaque unde ex possimus sed dignissimos molestiae illum
                  quam expedita laboriosam. Dolores voluptatem veritatis vel tempora?
                </p>
                <p>
                  {' '}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae eligendi
                  laborum magnam et dolorem, eaque unde ex possimus sed dignissimos molestiae illum
                  quam expedita laboriosam. Dolores voluptatem veritatis vel tempora?
                </p>
                <p>
                  {' '}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae eligendi
                  laborum magnam et dolorem, eaque unde ex possimus sed dignissimos molestiae illum
                  quam expedita laboriosam. Dolores voluptatem veritatis vel tempora?
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
