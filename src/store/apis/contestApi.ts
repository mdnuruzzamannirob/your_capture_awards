import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { PhotoToContestPayload, ContestPayload, PaginationMeta } from '../types/contestTypes';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
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
      invalidatesTags: [
        'PublicContests',
        'PrivateContests',
        'Contest',
        'JoinedContests',
        'ContestPhotos',
        'UserPhotos',
        'ContestRankPhotos',
        'ContestRankPhotographers',
      ],
    }),

    // get multiple contest data
    getPublicContests: builder.query<{ data: any[]; meta: PaginationMeta }, ContestPayload>({
      query: ({ status, page = 1, limit = 10 }) =>
        `/contests/ucontests?status=${status}&page=${page}&limit=${limit}`,
      providesTags: ['PublicContests'],
    }),

    // get multiple contest data
    getPrivateContests: builder.query<{ data: any[]; meta: PaginationMeta }, ContestPayload>({
      query: ({ status, page = 1, limit = 10 }) =>
        `/contests?status=${status}&page=${page}&limit=${limit}`,
      providesTags: ['PrivateContests'],
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
      providesTags: ['JoinedContests'],
      // Keep cache alive for 5 minutes so ContestDetails and JoinedContest page
      // share the same cache entry and avoid duplicate network calls.
      keepUnusedDataFor: 300,
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
      query: ({ id, page = 1, limit = 10 }) => `/contests/${id}/photos?page=${page}&limit=${limit}`,
      providesTags: (result, error, { id }) => [{ type: 'ContestPhotos', id }],
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
      providesTags: (result, error, { id }) => [{ type: 'ContestRankPhotos', id }],
    }),

    // get contest rank photographers
    getContestRankPhotographers: builder.query<
      { data: { participants: any[]; contestTotalVotes?: number }; meta: PaginationMeta },
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 12 }) =>
        `/contests/${id}/rank-photographer?page=${page}&limit=${limit}`,
      providesTags: (result, error, { id }) => [{ type: 'ContestRankPhotographers', id }],
    }),

    // create contest vote
    createVote: builder.mutation<{ data: { data: any } }, { id: string; photoIds: string[] }>({
      query: ({ id, photoIds }) => ({
        url: `/votes/${id}`,
        method: 'POST',
        body: { photoIds },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Contest', id },
        { type: 'ContestPhotos', id },
        { type: 'ContestRankPhotos', id },
        { type: 'ContestRankPhotographers', id },
        { type: 'PublicContests', id: 'LIST' },
        { type: 'PrivateContests', id: 'LIST' },
        { type: 'JoinedContests', id: 'LIST' },
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
} = contestApi;
