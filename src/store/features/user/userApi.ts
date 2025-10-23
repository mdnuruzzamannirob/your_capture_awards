import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/rtkQueryClient';
import { User } from './types';

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['User', 'Users'],
  baseQuery,
  endpoints: (builder) => ({
    // Get single user
    getUser: builder.query<User, string>({
      query: (id) => ({ url: `api/v1/users/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Get users
    getUsers: builder.query<User[], { page?: number; limit?: number; q?: string } | void>({
      query: (params) => ({ url: 'api/v1/users/all', params: params || { page: 1, limit: 20 } }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: 'User' as const, id: user.id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // Update user (partial)
    updateUser: builder.mutation<User, { id: string; patch: Partial<User> }>({
      query: ({ id, patch }) => ({ url: `api/v1/users/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // Forgot password: send OTP or reset link
    forgotPassword: builder.mutation<{ success: boolean; message?: string }, { email: string }>({
      query: (body) => ({ url: 'api/v1/users/forget-password', method: 'POST', body }),
      invalidatesTags: [{ type: 'User' }],
    }),

    // Reset password using token or OTP
    resetPassword: builder.mutation<
      { ok: boolean; message?: string },
      { token?: string; email?: string; password: string; confirmPassword: string }
    >({
      query: (body) => ({ url: 'api/v1/users/reset-password', method: 'PATCH', body }),
      invalidatesTags: [{ type: 'User' }],
    }),

    // Verify OTP
    verifyOTP: builder.mutation<{ reset_password_token?: string }, { email: string; code: string }>(
      {
        query: (body) => ({ url: 'api/v1/users/verify-otp', method: 'POST', body }),
        invalidatesTags: [{ type: 'User' }],
      },
    ),
  }),
});

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
} = userApi;
