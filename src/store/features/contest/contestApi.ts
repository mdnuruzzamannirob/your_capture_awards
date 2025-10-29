import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/rtkQueryClient';
import { ContestPayload, PhotoToContestPayload } from './types';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery,
  endpoints: (builder) => ({
    createPhotoToContest: builder.mutation<{ data: { data: any } }, PhotoToContestPayload>({
      query: ({ photo, photoId, contestId }) => ({
        url: `/contests/${contestId}/upload`,
        method: 'POST',
        body: photo ? photo : photoId,
      }),
    }),

    getContest: builder.query<{ data: { data: any } }, ContestPayload>({
      query: ({ status }) => `/contests?status=${status}`,
    }),
  }),
});

export const { useCreatePhotoToContestMutation, useGetContestQuery } = contestApi;
