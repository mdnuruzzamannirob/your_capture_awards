import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { setPhoto, setPhotos, deletePhoto, setStats } from '../slices/profileSlice';
import { Photo, Stats } from '../types/profileTypes';

type PhotosResponse = {
  data: Photo[] | { photos?: Photo[] };
};

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Photos', 'Stats'],
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
      invalidatesTags: ['Photos', 'Stats'],
    }),

    getPhotos: builder.query<PhotosResponse, void>({
      query: () => '/profiles/photos',
      providesTags: ['Photos'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;

          const photos = Array.isArray(data) ? data : (data.photos ?? []);
          dispatch(setPhotos(photos));
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
      invalidatesTags: ['Photos', 'Stats'],
    }),

    getStats: builder.query<{ data: Stats }, void>({
      query: () => '/profiles/stats',
      providesTags: ['Stats'],
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
