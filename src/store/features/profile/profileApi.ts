import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { deletePhoto, setPhoto, setPhotos, setStats } from './profileSlice';
import { Stats } from './types';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  endpoints: (builder) => ({
    createPhoto: builder.mutation<{ data: any }, FormData>({
      query: (formData) => ({
        url: '/profiles/photos/upload',
        method: 'POST',
        body: formData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setPhoto(data));
        } catch (err) {}
      },
    }),

    getPhotos: builder.query<{ data: any }, void>({
      query: () => '/profiles/photos',
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setPhotos(data.photos));
        } catch {}
      },
    }),

    deletePhoto: builder.mutation<{ data: any }, string>({
      query: (id) => ({
        url: `/profiles/photos/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(deletePhoto(id));
        } catch (err) {}
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

export const {
  useCreatePhotoMutation,
  useGetPhotosQuery,
  useGetStatsQuery,
  useDeletePhotoMutation,
} = profileApi;
