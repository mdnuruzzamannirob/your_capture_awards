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

    // Get users
    getUsers: builder.query<User[], { page?: number; limit?: number; q?: string } | void>({
      query: (params) => ({ url: '/users/all', params: params || { page: 1, limit: 20 } }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: 'User' as const, id: user.id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // Update user (partial)
    updateUser: builder.mutation<User, { id: string; patchData: Partial<User> }>({
      query: ({ id, patchData }) => ({ url: `/users/${id}`, method: 'PATCH', body: patchData }),
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
  useGetUsersQuery,
  useUpdateUserMutation,
  useUpdateAvatarMutation,
  useUpdateCoverMutation,
} = userApi;
