import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { User } from '../types/userTypes';
import { AuthUser } from '../types/authTypes';
import { setUser } from '../slices/authSlice';
import { authApi } from './authApi';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type UpdateProfileBody = {
  firstName: string;
  lastName: string;
  location: string;
};

type ChangePasswordBody = {
  oldPassword: string;
  newPassword: string;
};

type DeleteAccountBody = {
  password: string;
};

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['User', 'Users'],
  baseQuery: baseQuery(typeof window === 'undefined'),
  endpoints: (builder) => ({
    // Get user
    getUser: builder.query<User, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Update user (partial)
    updateUser: builder.mutation<ApiResponse<User>, UpdateProfileBody>({
      query: (updateData) => ({ url: '/users', method: 'PUT', body: updateData }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;

          dispatch(setUser(data as AuthUser));
          dispatch(authApi.util.invalidateTags(['Auth']));
        } catch (error) {
          console.error('Profile update failed:', error);
        }
      },
    }),

    changePassword: builder.mutation<ApiResponse<string>, ChangePasswordBody>({
      query: (body) => ({ url: '/users/change-password', method: 'PUT', body }),
    }),

    deleteAccount: builder.mutation<ApiResponse<string>, DeleteAccountBody>({
      query: (body) => ({ url: '/users/delete-account', method: 'DELETE', body }),
    }),

    // Update Avatar
    updateAvatar: builder.mutation<{ success: boolean; message?: string }, FormData>({
      query: (body) => ({ url: '/users/avatar', method: 'PATCH', body }),
      invalidatesTags: ['User', 'Users'],
    }),

    // Update Cover
    updateCover: builder.mutation<{ success: boolean; message?: string }, FormData>({
      query: (body) => ({ url: '/users/cover', method: 'PATCH', body }),
      invalidatesTags: ['User', 'Users'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useUpdateAvatarMutation,
  useUpdateCoverMutation,
} = userApi;
