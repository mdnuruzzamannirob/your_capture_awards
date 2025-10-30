'use client';

import { makeStore } from '@/store/makeStore';
import { Provider } from 'react-redux';

const ReduxProvider = ({
  children,
  preloadedState,
}: {
  children: React.ReactNode;
  preloadedState?: any;
}) => {
  const store = makeStore(preloadedState);

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
