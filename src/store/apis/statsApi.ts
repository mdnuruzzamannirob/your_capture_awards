import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { SiteStatsResponse } from '../types/statsTypes';

export const statsApi = createApi({
  reducerPath: 'statsApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['SiteStats'],
  endpoints: (builder) => ({
    getSiteStats: builder.query<SiteStatsResponse, void>({
      query: () => '/stats',
      providesTags: ['SiteStats'],
    }),
  }),
});

export const { useGetSiteStatsQuery } = statsApi;
