'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { MdOutlineSwapCalls } from 'react-icons/md';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';

export default function ModalTabs() {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2' | 'tab3'>('tab1');
  const [open, setOpen] = useState(false);

  const openModal = (tab: 'tab1' | 'tab2' | 'tab3') => {
    setActiveTab(tab);
    setOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tab1':
        return <p>This is content for Tab 1</p>;
      case 'tab2':
        return <p>This is content for Tab 2</p>;
      case 'tab3':
        return <p>This is content for Tab 3</p>;
      default:
        return null;
    }
  };

  return (
    <div className="space-x-2 py-5">
      {/* Buttons */}
      <div className="flex items-center gap-5">
        {' '}
        <button
          onClick={() => openModal('tab1')}
          className="text-primary bg-primary/10 flex items-center justify-center gap-1 rounded-sm px-5 py-2"
        >
          <MdOutlineSwapCalls className="size-5" /> 0
        </button>
        <button
          onClick={() => openModal('tab2')}
          className="text-primary bg-primary/10 flex items-center justify-center gap-1 rounded-sm px-5 py-2"
        >
          {' '}
          <AiOutlineThunderbolt className="size-5" /> 10
        </button>
        <button
          onClick={() => openModal('tab3')}
          className="text-primary bg-primary/10 flex items-center justify-center gap-1 rounded-sm px-5 py-2"
        >
          {' '}
          <IoKeyOutline className="size-5" /> 24
        </button>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-black-2-600 bg-background/95 text-foreground max-w-lg p-5">
          <DialogHeader>
            <DialogTitle />
          </DialogHeader>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            defaultValue="swap"
          >
            <TabsList className="text-foreground w-full bg-white/5">
              <TabsTrigger
                value="swap"
                className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
              >
                <MdOutlineSwapCalls /> Swap
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

            <TabsContent value="swap">Swap</TabsContent>
            <TabsContent value="boost">Boost</TabsContent>
            <TabsContent value="key">Key</TabsContent>
          </Tabs>

          <DialogClose className="mt-4">Close</DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
