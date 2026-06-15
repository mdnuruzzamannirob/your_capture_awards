import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';

export type SupportTicketPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type SupportTicketResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    ticket_no: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
};

export const supportApi = createApi({
  reducerPath: 'supportApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['SupportTickets'],
  endpoints: (builder) => ({
    submitSupportTicket: builder.mutation<SupportTicketResponse, SupportTicketPayload>({
      query: (body) => ({
        url: '/support',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSubmitSupportTicketMutation } = supportApi;
