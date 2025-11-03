import { SwapBoostKeyContext } from '@/providers/SwapBoostKeyProvider';
import { useContext } from 'react';

export const useSwapBoostKey = () => {
  const context = useContext(SwapBoostKeyContext);
  if (!context) throw new Error('useSwapBoostKey must be used within SwapBoostKeyProvider');
  return context;
};
