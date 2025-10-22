import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/rtkQueryClient';
import { setToken, setUser } from './authSlice';
import Cookies from 'js-cookie';
import { IUser, TSigninData, TSignupData } from './types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    signin: builder.mutation<{ token: string; user: IUser }, TSigninData>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.token));

          Cookies.set('token', data.token, {
            expires: 7,
            secure: true,
            sameSite: 'Strict',
            path: '/',
          });
        } catch (err) {}
      },
    }),

    signup: builder.mutation<{ token: string; user: IUser }, TSignupData>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.token));

          Cookies.set('token', data.token, {
            expires: 7,
            secure: true,
            sameSite: 'Strict',
            path: '/',
          });
        } catch (err) {}
      },
    }),

    getProfile: builder.query<any, void>({
      query: () => '/auth/profile',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));

          const cookieToken = Cookies.get('token');
          if (cookieToken) dispatch(setToken(cookieToken));
        } catch (err) {}
      },
    }),
  }),
});

export const { useSigninMutation, useSignupMutation, useGetProfileQuery } = authApi;
