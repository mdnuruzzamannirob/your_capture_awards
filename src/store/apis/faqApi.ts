import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FaqsResponse = {
  success: boolean;
  message: string;
  data: Faq[];
};

const normalizeFaq = (faq: Record<string, any>): Faq => ({
  id: faq.id,
  question: faq.question ?? '',
  answer: faq.answer ?? '',
  category: faq.category ?? null,
  order: Number(faq.order ?? 0),
  isActive: Boolean(faq.isActive),
  createdAt: faq.createdAt ?? '',
  updatedAt: faq.updatedAt ?? '',
});

export const faqApi = createApi({
  reducerPath: 'faqApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Faqs'],
  endpoints: (builder) => ({
    getFaqs: builder.query<FaqsResponse, { search?: string; category?: string } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.search?.trim()) searchParams.set('search', params.search.trim());
        if (params?.category?.trim()) searchParams.set('category', params.category.trim());
        const query = searchParams.toString();
        return query ? `/faqs?${query}` : '/faqs';
      },
      transformResponse: (response: any) => ({
        ...response,
        data: Array.isArray(response.data) ? response.data.map(normalizeFaq) : [],
      }),
      providesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),
  }),
});

export const { useGetFaqsQuery } = faqApi;
