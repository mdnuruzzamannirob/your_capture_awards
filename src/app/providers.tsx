'use client';

import { setUser } from '@/store/features/auth/authSlice';
import { IUser } from '@/store/features/auth/types';
import { makeStore } from '@/store/makeStore';
import { Provider } from 'react-redux';

const store = makeStore();

const Providers = ({
  children,
  user,
  token,
}: {
  children: React.ReactNode;
  user: IUser;
  token: string | null | undefined;
}) => {
  // Hydrate initial user data
  if (user) {
    store.dispatch(setUser(user));
  }

  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
