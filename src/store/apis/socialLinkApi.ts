import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';

export type SocialPlatform =
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'X'
  | 'YOUTUBE'
  | 'TIKTOK'
  | 'LINKEDIN'
  | 'PINTEREST'
  | 'WHATSAPP'
  | 'EMAIL'
  | 'WEBSITE';

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  url: string;
  order: number;
  isActive: boolean;
};

export type SocialLinksResponse = {
  success: boolean;
  message: string;
  data: SocialLink[];
};

export const socialLinkApi = createApi({
  reducerPath: 'socialLinkApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  endpoints: (builder) => ({
    getSocialLinks: builder.query<SocialLinksResponse, void>({
      query: () => '/social-links',
    }),
  }),
});

export const { useGetSocialLinksQuery } = socialLinkApi;
