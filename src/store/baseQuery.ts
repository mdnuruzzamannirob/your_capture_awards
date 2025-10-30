import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getServerToken } from '@/utils/getServerToken';

export const baseQuery = (
  isServer: boolean,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =>
  fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL_V1 || 'https://fttfmf0j-5002.inc1.devtunnels.ms/api/v1',

    prepareHeaders: async (headers) => {
      let token: string | undefined;

      if (isServer) {
        token = await getServerToken();
      } else {
        token = Cookies.get('token') ?? undefined;
      }

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  });
