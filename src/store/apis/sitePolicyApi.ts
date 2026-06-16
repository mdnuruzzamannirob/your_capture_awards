import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';

export type SitePolicy = {
  id: string;
  type: 'ABOUT' | 'TERMS' | 'POLICY';
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type SitePolicyResponse = {
  success: boolean;
  message: string;
  data: SitePolicy[];
};

export const sitePolicyApi = createApi({
  reducerPath: 'sitePolicyApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['SitePolicy'],
  endpoints: (builder) => ({
    getSitePolicy: builder.query<SitePolicyResponse, { type: 'ABOUT' | 'TERMS' | 'POLICY' }>({
      query: ({ type }) => `/site-policies?type=${type}`,
      providesTags: (result, error, { type }) => [{ type: 'SitePolicy', id: type }],
    }),
  }),
});

export const { useGetSitePolicyQuery } = sitePolicyApi;
