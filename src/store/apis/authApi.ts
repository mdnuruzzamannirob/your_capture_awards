import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import Cookies from 'js-cookie';
import { setTempEmail, setTempToken, setUser } from '../slices/authSlice';
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
      invalidatesTags: ['Auth'],
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
          dispatch(setUser(data.user));
        } catch (err) {
          console.error('Signin failed:', err);
        }
      },
    }),

    signup: builder.mutation<{ data: { token: string; user: AuthUser } }, SignupData>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
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
          dispatch(setUser(data.user));
        } catch (err) {
          console.error('Signup failed:', err);
        }
      },
    }),

    getMe: builder.query<{ data: AuthUser }, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));
        } catch (err) {
          console.error('Failed to fetch user:', err);
        }
      },
    }),

    forgotPassword: builder.mutation<{ success: boolean; message?: string }, { email: string }>({
      query: (body) => ({ url: '/users/forget-password', method: 'POST', body }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setTempEmail(arg.email));
        } catch (err) {
          console.error('Forgot password failed:', err);
        }
      },
    }),

    verifyOTP: builder.mutation<
      { data: { reset_password_token: string } },
      { email: string; code: string }
    >({
      query: (body) => ({ url: '/users/verify-otp', method: 'POST', body }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setTempToken(data?.reset_password_token));
        } catch (err) {
          console.error('OTP verification failed:', err);
        }
      },
    }),

    resetPassword: builder.mutation<
      { success: boolean; message?: string },
      { token?: string; email?: string; password: string; confirmPassword: string }
    >({
      query: (body) => ({ url: '/users/reset-password', method: 'PATCH', body }),
      invalidatesTags: ['Auth'],
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
