import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/rtkQueryClient';
import { setTempEmail, setTempToken, setToken, setUser } from './authSlice';
import Cookies from 'js-cookie';
import { AuthUser, SigninData, SignupData } from './types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
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
          dispatch(setUser(data));

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
          dispatch(setUser(data));

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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setUser(data));

          const cookieToken = Cookies.get('token') ?? null;
          if (cookieToken) dispatch(setToken(cookieToken));
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
} = authApi;
