'use client';

import { createContext, useState, ReactNode } from 'react';

type TabType = 'swap' | 'boost' | 'key';

interface SwapBoostKeyContextType {
  open: boolean;
  setOpen: (val: boolean) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  openModal: (tab?: TabType) => void;
  closeModal: () => void;
}

export const SwapBoostKeyContext = createContext<SwapBoostKeyContextType | null>(null);

export const SwapBoostKeyProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('swap');

  const openModal = (tab?: TabType) => {
    if (tab) setActiveTab(tab);
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const value: SwapBoostKeyContextType = {
    open,
    setOpen,
    activeTab,
    setActiveTab,
    openModal,
    closeModal,
  };

  return <SwapBoostKeyContext.Provider value={value}>{children}</SwapBoostKeyContext.Provider>;
};
