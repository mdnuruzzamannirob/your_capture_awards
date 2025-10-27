import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/rtkQueryClient';
import { User } from './types';

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['User', 'Users'],
  baseQuery,
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
    updateAvatar: builder.mutation<{ success: boolean; message?: string }, { avatar?: File }>({
      query: (body) => ({ url: 'api/v1/users/avatar', method: 'PATCH', body }),
      invalidatesTags: [{ type: 'User' }],
    }),

    // Update Cover
    updateCover: builder.mutation<{ success: boolean; message?: string }, { cover?: File }>({
      query: (body) => ({ url: 'api/v1/users/cover', method: 'PATCH', body }),
      invalidatesTags: [{ type: 'User' }],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdateAvatarMutation,
  useUpdateCoverMutation,
} = userApi;
