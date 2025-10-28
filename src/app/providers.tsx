'use client';

import { setUser } from '@/store/features/auth/authSlice';
import { makeStore } from '@/store/makeStore';
import { AuthData } from '@/types';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

const store = makeStore();

const Providers = ({ children, user }: { children: React.ReactNode; user: AuthData }) => {
  // Hydrate initial data
  useEffect(() => {
    if (user) store.dispatch(setUser(user));
  }, [user]);

  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
