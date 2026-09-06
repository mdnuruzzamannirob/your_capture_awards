import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';

export type ReportReason = 'OFF_TOPIC' | 'COPYRIGHT' | 'AI_GENERATED' | 'INAPPROPRIATE_CONTENT';

// reportedUserId is intentionally NOT part of this payload - voting is blind, so the
// client never learns whose photo it is. The backend resolves who's being reported
// from contestPhotoId instead (see Report/report.service.ts createReport).
export type CreateReportPayload = {
  contestPhotoId: string;
  reason: ReportReason;
  details?: string;
};

export type CreateReportResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
  };
};

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  endpoints: (builder) => ({
    createReport: builder.mutation<CreateReportResponse, CreateReportPayload>({
      query: (body) => ({
        url: '/reports',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateReportMutation } = reportApi;
