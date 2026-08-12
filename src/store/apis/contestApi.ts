import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { PhotoToContestPayload, ContestPayload, PaginationMeta } from '../types/contestTypes';

export type PromoteContestPhotoPayload = {
  contestId: string;
  photoId: string;
};

export type TradeContestPhotoPayload = {
  contestId: string;
  contestPhotoId: string;
  newPhotoId?: string;
  file?: File;
};

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  // Default cache lifetime to 5 minutes to prevent aggressive re-fetching. Override per endpoint as needed.
  keepUnusedDataFor: 300,
  tagTypes: [
    'PublicContests',
    'PrivateContests',
    'Contest',
    'JoinedContests',
    'ContestPhotos',
    'UserPhotos',
    'ContestRankPhotos',
    'ContestRankPhotographers',
  ],
  endpoints: (builder) => ({
    // create single contest or upload contest photo
    createPhotoToContest: builder.mutation<{ data: { data: any } }, PhotoToContestPayload>({
      query: ({ photo, photoIds, contestId }) => {
        // If uploading file
        if (photo) {
          const formData = new FormData();
          formData.append('photo', photo);

          return {
            url: `/contests/${contestId}/upload`,
            method: 'POST',
            body: formData,
          };
        }

        // If using existing profile photo
        return {
          url: `/contests/${contestId}/upload`,
          method: 'POST',
          body: { photoIds },
        };
      },
      invalidatesTags: (result, error, { contestId }) => [
        // Invalidate specific contest and joined lists
        { type: 'Contest', id: contestId },
        { type: 'JoinedContests', id: 'LIST' },
        { type: 'ContestPhotos', id: contestId },
        { type: 'UserPhotos', id: contestId },
        { type: 'PublicContests', id: 'LIST' },
        { type: 'PrivateContests', id: 'LIST' },
      ],
    }),

    // get multiple contest data
    getPublicContests: builder.query<{ data: any[]; meta: PaginationMeta }, ContestPayload>({
      query: ({ status, page = 1, limit = 10 }) =>
        `/contests/ucontests?status=${status}&page=${page}&limit=${limit}`,
      providesTags: (result, error, { status, page = 1 }) => [
        { type: 'PublicContests', id: `${status}-${page}` },
        { type: 'PublicContests', id: 'LIST' },
      ],
    }),

    // get multiple contest data
    getPrivateContests: builder.query<{ data: any[]; meta: PaginationMeta }, ContestPayload>({
      query: ({ status, page = 1, limit = 10 }) =>
        `/contests?status=${status}&page=${page}&limit=${limit}`,
      providesTags: (result, error, { status, page = 1 }) => [
        { type: 'PrivateContests', id: `${status}-${page}` },
        { type: 'PrivateContests', id: 'LIST' },
      ],
    }),

    // get single contest data
    getContest: builder.query<{ data: any }, { id: string }>({
      query: ({ id }) => `/contests/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'Contest', id }],
    }),

    // get join only contest data
    getJoinedContest: builder.query<{ data: any[]; meta: PaginationMeta }, ContestPayload>({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/contests/my-active-contests?page=${page}&limit=${limit}`,
      providesTags: (result, error, { page = 1 }) => [
        { type: 'JoinedContests', id: `page-${page}` },
        { type: 'JoinedContests', id: 'LIST' },
      ],
    }),

    // get contest photos
    getContestPhotos: builder.query<
      {
        success: boolean;
        message: string;
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPage: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
        data: {
          id: string;
          url: string;
          voteCount: number;
        }[];
      },
      {
        id: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ id, page = 1, limit = 10 }) =>
        `/contests/${id}/photos/vote?page=${page}&limit=${limit}`,
      providesTags: (result, error, { id, page = 1 }) => [
        { type: 'ContestPhotos', id: `${id}-page-${page}` },
        { type: 'ContestPhotos', id },
        { type: 'ContestPhotos', id: 'LIST' },
      ],
    }),

    // get user photos
    getUserPhotos: builder.query<{ data: { data: { url: string; id: string }[] } }, { id: string }>(
      {
        query: ({ id }) => `/contests/${id}/user-photos`,
        providesTags: (result, error, { id }) => [{ type: 'UserPhotos', id }],
      },
    ),

    // get contest rank photos
    getContestRankPhotos: builder.query<
      { data: any[]; meta: PaginationMeta },
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 12 }) =>
        `/contests/${id}/rank-photos?page=${page}&limit=${limit}`,
      providesTags: (result, error, { id, page = 1 }) => [
        { type: 'ContestRankPhotos', id: `${id}-page-${page}` },
        { type: 'ContestRankPhotos', id },
      ],
    }),

    // get contest rank photographers
    getContestRankPhotographers: builder.query<
      { data: { participants: any[]; contestTotalVotes?: number }; meta: PaginationMeta },
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 12 }) =>
        `/contests/${id}/rank-photographer?page=${page}&limit=${limit}`,
      providesTags: (result, error, { id, page = 1 }) => [
        { type: 'ContestRankPhotographers', id: `${id}-page-${page}` },
        { type: 'ContestRankPhotographers', id },
      ],
    }),

    // create contest vote
    createVote: builder.mutation<{ data: { data: any } }, { id: string; photoIds: string[] }>({
      query: ({ id, photoIds }) => ({
        url: `/votes/${id}`,
        method: 'POST',
        body: { photoIds },
      }),
      invalidatesTags: (result, error, { id }) => [
        // Refresh only the targeted elements to maintain caching efficiency
        { type: 'Contest', id },
        { type: 'ContestPhotos', id },
        { type: 'ContestRankPhotos', id },
        { type: 'ContestRankPhotographers', id },
        { type: 'JoinedContests', id: 'LIST' },
        { type: 'PublicContests', id: 'LIST' },
        { type: 'PrivateContests', id: 'LIST' },
      ],
    }),

    // promote a contest photo
    promoteContestPhoto: builder.mutation<
      { success: boolean; message: string; data?: any },
      PromoteContestPhotoPayload
    >({
      query: ({ contestId, photoId }) => ({
        url: '/contests/photos/promote',
        method: 'POST',
        body: { contestId, photoId },
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: 'Contest', id: contestId },
        { type: 'JoinedContests', id: 'LIST' },
        { type: 'ContestPhotos', id: contestId },
        { type: 'UserPhotos', id: contestId },
      ],
    }),

    // trade a contest photo
    tradeContestPhoto: builder.mutation<
      { success: boolean; message: string; data?: any },
      TradeContestPhotoPayload
    >({
      query: ({ contestId, contestPhotoId, newPhotoId, file }) => {
        const formData = new FormData();
        formData.append('contestId', contestId);
        formData.append('contestPhotoId', contestPhotoId);
        if (newPhotoId) formData.append('newPhotoId', newPhotoId);
        if (file) formData.append('file', file);

        return {
          url: '/contests/trade',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { contestId }) => [
        { type: 'Contest', id: contestId },
        { type: 'JoinedContests', id: 'LIST' },
        { type: 'ContestPhotos', id: contestId },
        { type: 'UserPhotos', id: contestId },
      ],
    }),
  }),
});

export const {
  useCreatePhotoToContestMutation,
  useGetPublicContestsQuery,
  useGetPrivateContestsQuery,
  useGetContestQuery,
  useGetJoinedContestQuery,
  useGetContestPhotosQuery,
  useLazyGetContestPhotosQuery,
  useLazyGetUserPhotosQuery,
  useGetUserPhotosQuery,
  useGetContestRankPhotosQuery,
  useLazyGetContestRankPhotosQuery,
  useGetContestRankPhotographersQuery,
  useLazyGetContestRankPhotographersQuery,
  useCreateVoteMutation,
  usePromoteContestPhotoMutation,
  useTradeContestPhotoMutation,
} = contestApi;
