import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { DiscoverPhotosResponse } from '../types/discoverTypes';

export const discoverApi = createApi({
  reducerPath: 'discoverApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['DiscoverPhotos'],
  endpoints: (builder) => ({
    getDiscoverPhotos: builder.query<DiscoverPhotosResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/achievements/photos?page=${page}&limit=${limit}`,
      providesTags: ['DiscoverPhotos'],
    }),
  }),
});

export const { useGetDiscoverPhotosQuery } = discoverApi;
