import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { contestApi } from './contestApi';
import { setPhoto, setPhotos, deletePhoto, setStats } from '../slices/profileSlice';
import { Photo, ProfileAchievementsResponse, Stats } from '../types/profileTypes';

type PhotosResponse = {
  data: Photo[] | { photos?: Photo[] };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type DirectUploadUrlResponse = {
  data: {
    uploadUrl: string;
    key: string;
    expiresIn: number;
    headers: Record<string, string>;
  };
};

type CreatePhotoResponse = {
  data: Photo;
};

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Photos', 'Stats', 'Achievements'],
  endpoints: (builder) => ({
    createPhoto: builder.mutation<CreatePhotoResponse, File>({
      async queryFn(file, _queryApi, _extraOptions, apiQuery) {
        const presignResult = await apiQuery({
          url: '/profiles/photos/direct-upload-url',
          method: 'POST',
          body: {
            fileName: file.name,
            contentType: file.type,
            fileSize: file.size,
          },
        });

        if (presignResult.error) return { error: presignResult.error };

        const { uploadUrl, key, headers } = (presignResult.data as DirectUploadUrlResponse).data;

        try {
          // This request goes straight to DigitalOcean Spaces. In particular,
          // it must not include the API bearer token added by our base query.
          const uploadResult = await fetch(uploadUrl, {
            method: 'PUT',
            headers,
            body: file,
          });

          if (!uploadResult.ok) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: `Spaces upload failed with status ${uploadResult.status}`,
                data: { message: 'Unable to upload the photo. Please try again.' },
              },
            };
          }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Spaces upload failed',
              data: { message: 'Unable to upload the photo. Please try again.' },
            },
          };
        }

        const confirmResult = await apiQuery({
          url: '/profiles/photos/confirm-upload',
          method: 'POST',
          body: { key },
        });

        if (confirmResult.error) return { error: confirmResult.error };
        return { data: confirmResult.data as CreatePhotoResponse };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setPhoto(data));
        } catch (err) {}
      },
      invalidatesTags: ['Photos', 'Stats'],
    }),

    getPhotos: builder.query<PhotosResponse, { page?: number; limit?: number } | void>({
      query: (params) => {
        const { page = 1, limit = 20 } = params ?? {};
        return `/profiles/photos?page=${page}&limit=${limit}`;
      },
      providesTags: ['Photos'],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;

          if ((params?.page ?? 1) === 1) {
            const photos = Array.isArray(data) ? data : (data.photos ?? []);
            dispatch(setPhotos(photos));
          }
        } catch {}
      },
    }),

    deletePhoto: builder.mutation<{ data: any }, string>({
      query: (id) => ({
        url: `/profiles/photos/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(deletePhoto(id));
        } catch (err) {}
      },
      invalidatesTags: ['Photos', 'Stats'],
    }),

    // Owner-only: replaces the photo's labels (tags) with the given list
    updatePhotoLabels: builder.mutation<
      { data: { id: string; labels: string[] } },
      { photoId: string; labels: string[] }
    >({
      query: ({ photoId, labels }) => ({
        url: `/profiles/photos/${photoId}/labels`,
        method: 'PATCH',
        body: { labels },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // the contest "choose from profile" pickers search these labels
          dispatch(contestApi.util.invalidateTags(['UserPhotos']));
        } catch {}
      },
      invalidatesTags: (result, error, { photoId }) => [{ type: 'Photos', id: photoId }],
    }),

    getStats: builder.query<{ data: Stats }, void>({
      query: () => '/profiles/stats',
      providesTags: ['Stats'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setStats(data));
        } catch {}
      },
    }),

    // Own photo details: GET /profiles/photos/:photoId
    // Returns: { data: { photo: { ...Photo, user: {...}, isLiked, isFollowed }, votes, comments, achievements } }
    getMyPhotoDetails: builder.query<
      { data: { photo: any; votes: number; comments: any[]; achievememnts: any[] } },
      string
    >({
      query: (photoId) => `/profiles/photos/${photoId}`,
      providesTags: (result, error, photoId) => [{ type: 'Photos', id: photoId }],
    }),

    getOtherUserProfile: builder.query<{ data: any }, string>({
      query: (id) => `/profiles/users/${id}/profile`,
      providesTags: (result, error, id) => [{ type: 'Stats' as const, id }],
    }),

    getOtherUserPhotos: builder.query<
      { data: Photo[]; meta?: any },
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 10 }) => `/profiles/users/${id}?page=${page}&limit=${limit}`,
      providesTags: ['Photos'],
    }),

    getOtherUserStats: builder.query<{ data: Stats }, string>({
      query: (id) => `/profiles/users/${id}/stats`,
      providesTags: ['Stats'],
    }),

    getProfileAchievements: builder.query<
      ProfileAchievementsResponse,
      { isOwn: boolean; userId?: string }
    >({
      query: ({ isOwn, userId }) =>
        isOwn ? '/achievements/profile' : `/achievements/users/${userId}/profile`,
      providesTags: ['Achievements'],
    }),

    // Public photo details: GET /profiles/users/:id/photos/:photoId
    // Returns: { data: { photo: { ...Photo, isLiked }, photoOwner: { ...user, isFollowed }, votes, comments } }
    getPublicPhotoDetails: builder.query<
      {
        data: {
          photo: any;
          photoOwner: any;
          votes: number;
          comments: any[];
          commentsMeta?: any;
          achievememnts: any[];
        };
      },
      { id: string; photoId: string }
    >({
      query: ({ id, photoId }) => `/profiles/users/${id}/photos/${photoId}`,
      providesTags: (result, error, { photoId }) => [{ type: 'Photos', id: photoId }],
    }),
  }),
});

export const {
  useCreatePhotoMutation,
  useGetPhotosQuery,
  useGetStatsQuery,
  useDeletePhotoMutation,
  useUpdatePhotoLabelsMutation,
  useGetMyPhotoDetailsQuery,
  useLazyGetMyPhotoDetailsQuery,
  useGetOtherUserProfileQuery,
  useGetOtherUserPhotosQuery,
  useLazyGetOtherUserPhotosQuery,
  useGetOtherUserStatsQuery,
  useGetProfileAchievementsQuery,
  useGetPublicPhotoDetailsQuery,
  useLazyGetPublicPhotoDetailsQuery,
} = profileApi;
