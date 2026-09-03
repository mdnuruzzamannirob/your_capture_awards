import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import {
  ApiSuccessResponse,
  NotificationItem,
  NotificationListResponse,
} from '@/store/types/notificationTypes';

const notificationTag = { type: 'Notifications' as const, id: 'LIST' };

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getUserNotifications: builder.query<
      ApiSuccessResponse<NotificationListResponse>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `/notifications/users?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => ({
        success: response.success,
        message: response.message,
        data: {
          notifications: Array.isArray(response.data) ? response.data : [],
          meta: response.meta ?? {
            page: 1,
            limit: 10,
            total: 0,
            totalPage: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      }),
      providesTags: [notificationTag],
    }),

    markAllNotificationsRead: builder.mutation<ApiSuccessResponse<{ count: number }>, void>({
      query: () => ({
        url: '/notifications/read',
        method: 'PATCH',
      }),
      invalidatesTags: [notificationTag],
    }),

    markNotificationRead: builder.mutation<ApiSuccessResponse<NotificationItem>, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          notificationApi.util.updateQueryData(
            'getUserNotifications',
            { page: 1, limit: 10 },
            (draft) => {
              const notification = draft.data.notifications.find(
                (item) => item.id === notificationId,
              );

              if (notification) notification.isRead = true;
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [notificationTag],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} = notificationApi;
