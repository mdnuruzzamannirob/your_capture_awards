import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { ContestPayload, PhotoToContestPayload } from './types';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  endpoints: (builder) => ({
    createPhotoToContest: builder.mutation<{ data: { data: any } }, PhotoToContestPayload>({
      query: ({ photo, photoId, contestId }) => {
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
          body: photoId,
        };
      },
    }),

    getContests: builder.query<{ data: { data: any } }, ContestPayload>({
      query: ({ status }) => `/contests?status=${status}`,
    }),

    getContest: builder.query<{ data: any }, { id: string }>({
      query: ({ id }) => `/contests/${id}`,
    }),

    getJoinedContest: builder.query<{ data: { data: any } }, ContestPayload | void>({
      query: () => `/contests/my-active-contests`,
    }),

    getContestPhotos: builder.query<
      { data: { data: { url: string; id: string }[] } },
      { id: string }
    >({
      query: ({ id }) => `/contests/${id}/photos`,
    }),

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
  useGetContestsQuery,
  useGetContestQuery,
  useGetJoinedContestQuery,
  useGetContestPhotosQuery,
  useLazyGetContestPhotosQuery,
  useCreateVoteMutation,
} = contestApi;
