import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { profileApi } from './profileApi';

export const socialApi = createApi({
  reducerPath: 'socialApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Follows', 'Likes'],
  endpoints: (builder) => ({
    toggleFollow: builder.mutation<
      { success: boolean; message: string; data: any },
      { userId: string }
    >({
      query: (body) => ({
        url: '/follows/toggole',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Follows'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate profile statistics (followers/following counts)
          dispatch(profileApi.util.invalidateTags(['Stats']));
        } catch (err) {}
      },
    }),

    getFollowers: builder.query<
      { success: boolean; message: string; meta: any; data: any[] },
      { userId?: string; page: number; limit: number }
    >({
      query: ({ userId, page, limit }) => ({
        url: userId
          ? `/follows/followers/${userId}?page=${page}&limit=${limit}`
          : `/follows/followers?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Follows'],
    }),

    getFollowings: builder.query<
      { success: boolean; message: string; meta: any; data: any[] },
      { userId?: string; page: number; limit: number }
    >({
      query: ({ userId, page, limit }) => ({
        url: userId
          ? `/follows/followings/${userId}?page=${page}&limit=${limit}`
          : `/follows/followings?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Follows'],
    }),

    getLikedPhotos: builder.query<
      { success: boolean; message: string; meta: any; data: any[] },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `/likes/photos?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Likes'],
    }),

    toggleLike: builder.mutation<
      { success: boolean; message: string; data: any },
      string
    >({
      query: (photoId) => ({
        url: `/likes/photos/${photoId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Likes'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate profile stats and photos tags to update like counts
          dispatch(profileApi.util.invalidateTags(['Stats', 'Photos']));
        } catch (err) {}
      },
    }),
  }),
});

export const {
  useToggleFollowMutation,
  useGetFollowersQuery,
  useLazyGetFollowersQuery,
  useGetFollowingsQuery,
  useLazyGetFollowingsQuery,
  useGetLikedPhotosQuery,
  useLazyGetLikedPhotosQuery,
  useToggleLikeMutation,
} = socialApi;
