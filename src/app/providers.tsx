'use client';

import { setUser } from '@/store/features/auth/authSlice';
import { makeStore } from '@/store/makeStore';
import { AuthData } from '@/types';
import { Provider } from 'react-redux';

const store = makeStore();

const Providers = ({ children, user }: { children: React.ReactNode; user: AuthData }) => {
  // Hydrate initial data
  if (user) {
    store.dispatch(setUser(user));
  }

  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
