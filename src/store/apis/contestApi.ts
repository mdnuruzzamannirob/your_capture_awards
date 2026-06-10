import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { PhotoToContestPayload, ContestPayload, PaginationMeta } from '../types/contestTypes';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  // Default cache lifetime: 60 seconds. Override per endpoint as needed.
  keepUnusedDataFor: 60,
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
        // Invalidate the specific contest entry and its related data.
        // Do NOT blast every tag — keep unrelated cache entries intact.
        { type: 'Contest', id: contestId },
        { type: 'JoinedContests', id: 'LIST' },
        { type: 'ContestPhotos', id: contestId },
        { type: 'UserPhotos', id: contestId },
        'PublicContests',
        'PrivateContests',
      ],
    }),

    // get multiple contest data
    getPublicContests: builder.query<{ data: any[]; meta: PaginationMeta }, ContestPayload>({
      query: ({ status, page = 1, limit = 10 }) =>
        `/contests/ucontests?status=${status}&page=${page}&limit=${limit}`,
      // Tag with a stable LIST id so invalidation only hits this tag type.
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
      providesTags: (result, error, { id }) => [
        { type: 'ContestPhotos', id },
        { type: 'ContestPhotos', id: 'LIST' },
      ],
      // Keep contest photos cached for 5 minutes across navigations.
      keepUnusedDataFor: 300,
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
        // Refresh the specific contest data and its photos/ranks after voting.
        { type: 'Contest', id },
        { type: 'ContestPhotos', id },
        { type: 'ContestRankPhotos', id },
        { type: 'ContestRankPhotographers', id },
        // Refresh joined contest list so vote counts update on the joined page.
        { type: 'JoinedContests', id: 'LIST' },
        // Public/private list may show vote count badges — refresh them too.
        { type: 'PublicContests', id: 'LIST' },
        { type: 'PrivateContests', id: 'LIST' },
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
