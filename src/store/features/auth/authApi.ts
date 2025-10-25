import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/rtkQueryClient';
import { setToken, setUser } from './authSlice';
import Cookies from 'js-cookie';
import { IUser, TSigninData, TSignupData } from './types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    signin: builder.mutation<{ data: { token: string; user: IUser } }, TSigninData>({
      query: (credentials) => ({
        url: '/api/v1/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.data.token));
          dispatch(setUser(data.data.user));

          Cookies.set('token', data.data.token, {
            expires: 7,
            secure: true,
            sameSite: 'Strict',
            path: '/',
          });
        } catch (err) {}
      },
    }),

    facebookSignin: builder.mutation<
      { data: { token: string; user: IUser } },
      { accessToken: string }
    >({
      query: ({ accessToken }) => ({
        url: 'api/v1/auth/facebook',
        method: 'POST',
        body: { access_token: accessToken },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.data?.token));
        } catch (err) {}
      },
    }),

    googleSignin: builder.query<{ data: { token: string; user: IUser } }, void>({
      query: () => ({
        url: 'api/v1/auth/google',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.data?.token));
        } catch (err) {}
      },
    }),

    signup: builder.mutation<{ data: { token: string; user: IUser } }, TSignupData>({
      query: (userData) => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.data.token));
          dispatch(setUser(data.data.user));

          Cookies.set('token', data.data.token, { expires: 7 });
        } catch {}
      },
    }),

    getMe: builder.query<{ data: { user: IUser; token: string | null } }, void>({
      query: () => '/api/v1/auth/me',
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));

          const cookieToken = Cookies.get('token') ?? null;
          if (cookieToken) dispatch(setToken(cookieToken));
        } catch {}
      },
    }),
  }),
});

export const { useSigninMutation, useSignupMutation, useGetMeQuery } = authApi;
