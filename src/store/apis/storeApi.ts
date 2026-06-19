import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import {
  PurchaseStoreProductResponse,
  StoreProductsResponse,
  StoreStatsResponse,
} from '../types/storeTypes';

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['StoreStats', 'StoreProducts'],
  endpoints: (builder) => ({
    getStoreStats: builder.query<StoreStatsResponse, void>({
      query: () => ({ url: '/users/store', method: 'GET' }),
      providesTags: ['StoreStats'],
    }),

    getStoreProducts: builder.query<StoreProductsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/stores?page=${page}&limit=${limit}`,
      providesTags: ['StoreProducts'],
    }),

    purchaseStoreProduct: builder.mutation<PurchaseStoreProductResponse, string>({
      query: (productId) => ({
        url: `/stores/${productId}/purchase`,
        method: 'POST',
      }),
      invalidatesTags: ['StoreStats'],
    }),
  }),
});

export const { useGetStoreStatsQuery, useGetStoreProductsQuery, usePurchaseStoreProductMutation } =
  storeApi;
