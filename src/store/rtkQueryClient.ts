import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import type { RootState } from './makeStore';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL_V1 || 'https://fttfmf0j-5002.inc1.devtunnels.ms/api/v1',

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
