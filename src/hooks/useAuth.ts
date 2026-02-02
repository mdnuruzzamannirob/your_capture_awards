'use client';

import { useGetMeQuery } from '@/store/apis/authApi';
import Cookies from 'js-cookie';
import { useState, useSyncExternalStore } from 'react';

const tokenListeners: Set<() => void> = new Set();
let currentToken: string | null = null;

if (typeof window !== 'undefined') {
  currentToken = Cookies.get('token') ?? null;
}

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return Cookies.get('token') ?? null;
};

const subscribe = (listener: () => void) => {
  tokenListeners.add(listener);

  window.addEventListener('storage', () => {
    const newToken = getToken();
    if (newToken !== currentToken) {
      currentToken = newToken;
      listener();
    }
  });

  const interval = setInterval(() => {
    const newToken = getToken();
    if (newToken !== currentToken) {
      currentToken = newToken;
      listener();
    }
  }, 1000);

  return () => {
    tokenListeners.delete(listener);
    clearInterval(interval);
  };
};

export const useAuth = () => {
  const [initialToken] = useState(() => getToken());

  const token = useSyncExternalStore(
    subscribe,
    () => getToken(),
    () => initialToken,
  );

  const {
    data: meData,
    isLoading,
    error,
    refetch,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });

  const user = meData?.data ?? null;
  const isAuthenticated = !!token;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    refetch,
  };
};
