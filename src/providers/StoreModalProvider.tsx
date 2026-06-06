'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type StoreModalContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openStore: () => void;
};

const StoreModalContext = createContext<StoreModalContextValue | null>(null);

export const useStoreModal = () => {
  const ctx = useContext(StoreModalContext);
  if (!ctx) {
    throw new Error('useStoreModal must be used within StoreModalProvider');
  }
  return ctx;
};

export const StoreModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      openStore: () => setOpen(true),
    }),
    [open],
  );

  return <StoreModalContext.Provider value={value}>{children}</StoreModalContext.Provider>;
};
