import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { PhotoToContestPayload, ContestPayload } from '../types/contestTypes';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
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
    }),

    // get multiple contest data
    getPublicContests: builder.query<{ data: { data: any } }, ContestPayload>({
      query: ({ status, page = 1, limit = 10 }) =>
        `/contests/ucontests?status=${status}&page=${page}&limit=${limit}`,
    }),

    // get multiple contest data
    getPrivateContests: builder.query<{ data: { data: any } }, ContestPayload>({
      query: ({ status, page = 1, limit = 10 }) =>
        `/contests?status=${status}&page=${page}&limit=${limit}`,
    }),

    // get single contest data
    getContest: builder.query<{ data: any }, { id: string }>({
      query: ({ id }) => `/contests/${id}`,
    }),

    // get join only contest data
    getJoinedContest: builder.query<{ data: { data: any } }, ContestPayload>({
      query: ({ page = 1, limit = 10 }) =>
        `/contests/my-active-contests?page=${page}&limit=${limit}`,
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
    }),

    // get user photos
    getUserPhotos: builder.query<{ data: { data: { url: string; id: string }[] } }, { id: string }>(
      {
        query: ({ id }) => `/contests/${id}/user-photos`,
      },
    ),

    // get contest rank photos
    getContestRankPhotos: builder.query<{ data: any }, { id: string }>({
      query: ({ id }) => `/contests/${id}/rank-photos`,
    }),

    // get contest rank photographers
    getContestRankPhotographers: builder.query<{ data: any }, { id: string }>({
      query: ({ id }) => `/contests/${id}/rank-photographer`,
    }),

    // create contest vote
    createVote: builder.mutation<{ data: { data: any } }, { id: string; photoIds: string[] }>({
      query: ({ id, photoIds }) => ({
        url: `/votes/${id}`,
        method: 'POST',
        body: { photoIds },
      }),
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
