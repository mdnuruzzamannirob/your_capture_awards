import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/rtkQueryClient';
import { setPhotos, setStats } from './profileSlice';
import { Stats } from './types';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  endpoints: (builder) => ({
    createPhoto: builder.mutation<{ data: any }, { photo: File }>({
      query: (body) => ({
        url: '/profiles/photos',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // try {
        //   const {
        //     data: { data },
        //   } = await queryFulfilled;
        //   dispatch(setUser(data));
        //   Cookies.set('token', data.token, {
        //     expires: 7,
        //     secure: true,
        //     sameSite: 'Strict',
        //     path: '/',
        //   });
        // } catch (err) {}
      },
    }),

    getPhotos: builder.query<{ data: any }, void>({
      query: () => '/profiles/photos',
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setPhotos(data));
        } catch {}
      },
    }),

    getStats: builder.query<{ data: Stats }, void>({
      query: () => '/profiles/stats',
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setStats(data));
        } catch {}
      },
    }),
  }),
});

export const { useCreatePhotoMutation, useGetPhotosQuery, useGetStatsQuery } = profileApi;
