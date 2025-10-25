'use client';

import { makeStore } from '@/store/makeStore';
import { Provider } from 'react-redux';

const store = makeStore();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
