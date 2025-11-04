import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { ContestPayload, PhotoToContestPayload } from './types';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  endpoints: (builder) => ({
    // create single contest or upload contest photo
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

    // get multiple contest data
    getContests: builder.query<{ data: { data: any } }, ContestPayload>({
      query: ({ status }) => `/contests?status=${status}`,
    }),

    // get single contest data
    getContest: builder.query<{ data: any }, { id: string }>({
      query: ({ id }) => `/contests/${id}`,
    }),

    // get join only contest data
    getJoinedContest: builder.query<{ data: { data: any } }, ContestPayload | void>({
      query: () => `/contests/my-active-contests`,
    }),

    // get contest photos
    getContestPhotos: builder.query<
      { data: { data: { url: string; id: string }[] } },
      { id: string }
    >({
      query: ({ id }) => `/contests/${id}/photos`,
    }),

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
  useGetContestsQuery,
  useGetContestQuery,
  useGetJoinedContestQuery,
  useGetContestPhotosQuery,
  useLazyGetContestPhotosQuery,
  useGetContestRankPhotosQuery,
  useGetContestRankPhotographersQuery,
  useCreateVoteMutation,
} = contestApi;
