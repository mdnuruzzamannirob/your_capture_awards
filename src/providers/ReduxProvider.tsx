'use client';

import { makeStore } from '@/store/makeStore';
import { useMemo } from 'react';
import { Provider } from 'react-redux';

const ReduxProvider = ({
  children,
  preloadedState,
}: {
  children: React.ReactNode;
  preloadedState?: any;
}) => {
  // Store must be created only ONCE per mount. Using useMemo with [] deps
  // ensures the same store instance is reused across re-renders, so the
  // RTK Query cache survives all client-side navigation events in production.
  const store = useMemo(() => makeStore(preloadedState), []);

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
