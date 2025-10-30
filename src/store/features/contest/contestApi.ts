import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { ContestPayload, PhotoToContestPayload } from './types';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  endpoints: (builder) => ({
    createPhotoToContest: builder.mutation<{ data: { data: any } }, PhotoToContestPayload>({
      query: ({ photo, photoId, contestId }) => ({
        url: `/contests/${contestId}/upload`,
        method: 'POST',
        body: photo ? photo : photoId,
      }),
    }),

    getJoinedContest: builder.query<{ data: { data: any } }, ContestPayload | void>({
      query: () => `/contests/my-active-contests`,
    }),

    getContest: builder.query<{ data: { data: any } }, ContestPayload>({
      query: ({ status }) => `/contests?status=${status}`,
    }),
  }),
});

export const { useCreatePhotoToContestMutation, useGetContestQuery, useGetJoinedContestQuery } =
  contestApi;
