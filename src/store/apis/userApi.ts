import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { User } from '../types/userTypes';

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
    updateUser: builder.mutation<User, { id: string; updateData: Partial<User> }>({
      query: ({ id, updateData }) => ({ url: `/users`, method: 'PUT', body: updateData }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'Users', id: 'LIST' },
      ],
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
  useUpdateAvatarMutation,
  useUpdateCoverMutation,
} = userApi;
