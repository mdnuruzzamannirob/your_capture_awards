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

export default function SBKModal() {
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
        <DialogContent className="border-black-2-600 bg-background/95 text-foreground max-w-lg p-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold capitalize">{activeTab}</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
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

            <TabsContent value="swap">
              <p className="text-muted-foreground mt-3 text-sm">
                This is the <b>Swap</b> content.
              </p>
            </TabsContent>

            <TabsContent value="boost">
              <p className="text-muted-foreground mt-3 text-sm">
                This is the <b>Boost</b> content.
              </p>
            </TabsContent>

            <TabsContent value="key">
              <p className="text-muted-foreground mt-3 text-sm">
                This is the <b>Key</b> content.
              </p>
            </TabsContent>
          </Tabs>

          <DialogClose className="bg-primary/10 hover:bg-primary/20 mt-4 rounded-md px-4 py-2">
            Close
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
