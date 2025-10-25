import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import type { RootState } from './makeStore';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://fttfmf0j-5002.inc1.devtunnels.ms',

  prepareHeaders: (headers, { getState }) => {
    let token: string | null =
      typeof window !== 'undefined' ? (Cookies.get('token') ?? null) : null;

    if (!token) {
      const state = getState() as RootState;
      token = state?.auth?.token;
    }

    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});
