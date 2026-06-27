import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';

export interface CommentProvider {
  id?: string;
  name?: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  text: string;
  photoId: string | null;
  parentId: string | null;
  providerId?: string;
  provider?: CommentProvider;
  time?: string;
  createdAt?: string;
  updatedAt?: string;
  replies?: Comment[];
  commentReplies?: Comment[];
}

export interface CommentsResponse {
  success: boolean;
  message?: string;
  data: Comment[];
}

export interface SingleCommentResponse {
  success: boolean;
  message?: string;
  data: Comment;
}

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    // GET /comments/photos/:photoId
    getPhotoComments: builder.query<CommentsResponse, string>({
      query: (photoId) => `/comments/photos/${photoId}`,
      providesTags: (result, error, photoId) => [{ type: 'Comments', id: photoId }],
    }),

    // POST /comments/photos/:photoId
    addComment: builder.mutation<SingleCommentResponse, { photoId: string; text: string }>({
      query: ({ photoId, text }) => ({
        url: `/comments/photos/${photoId}`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (result, error, { photoId }) => [{ type: 'Comments', id: photoId }],
    }),

    // POST /comments/reply/:commentId
    addReply: builder.mutation<
      SingleCommentResponse,
      { commentId: string; text: string; photoId: string }
    >({
      query: ({ commentId, text }) => ({
        url: `/comments/reply/${commentId}`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (result, error, { photoId }) => [{ type: 'Comments', id: photoId }],
    }),

    // PUT /comments/:commentId
    updateComment: builder.mutation<
      SingleCommentResponse,
      { commentId: string; text: string; photoId: string }
    >({
      query: ({ commentId, text }) => ({
        url: `/comments/${commentId}`,
        method: 'PUT',
        body: { text },
      }),
      invalidatesTags: (result, error, { photoId }) => [{ type: 'Comments', id: photoId }],
    }),

    // DELETE /comments/:commentId
    deleteComment: builder.mutation<
      { success: boolean; message?: string },
      { commentId: string; photoId: string }
    >({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { photoId }) => [{ type: 'Comments', id: photoId }],
    }),
  }),
});

export const {
  useGetPhotoCommentsQuery,
  useLazyGetPhotoCommentsQuery,
  useAddCommentMutation,
  useAddReplyMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
