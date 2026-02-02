import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import Cookies from 'js-cookie';
import { setTempEmail, setTempToken } from '../slices/authSlice';
import { AuthUser, SigninData, SignupData } from '../types/authTypes';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    signin: builder.mutation<{ data: { token: string; user: AuthUser } }, SigninData>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;

          Cookies.set('token', data.token, {
            expires: 7,
            secure: true,
            sameSite: 'Strict',
            path: '/',
          });
        } catch (err) {}
      },
    }),

    signup: builder.mutation<{ data: { token: string; user: AuthUser } }, SignupData>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;

          Cookies.set('token', data.token, {
            expires: 7,
            secure: true,
            sameSite: 'Strict',
            path: '/',
          });
        } catch {}
      },
    }),

    getMe: builder.query<{ data: { user: AuthUser; token: string | null } }, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;

          const payload = {
            user: data,
            token: Cookies.get('token') ?? null,
          };
        } catch {}
      },
    }),

    forgotPassword: builder.mutation<{ success: boolean; message?: string }, { email: string }>({
      query: (body) => ({ url: '/users/forget-password', method: 'POST', body }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(setTempEmail(arg.email));
        } catch (err) {}
      },
    }),

    verifyOTP: builder.mutation<
      { data: { reset_password_token: string } },
      { email: string; code: string }
    >({
      query: (body) => ({ url: '/users/verify-otp', method: 'POST', body }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;

          dispatch(setTempToken(data?.reset_password_token));
        } catch (err) {}
      },
    }),

    resetPassword: builder.mutation<
      { success: boolean; message?: string },
      { token?: string; email?: string; password: string; confirmPassword: string }
    >({
      query: (body) => ({ url: '/users/reset-password', method: 'PATCH', body }),
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useLazyGetMeQuery,
} = authApi;
