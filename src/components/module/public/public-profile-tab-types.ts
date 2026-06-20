import { PublicPhoto, PublicProfileMini } from '@/lib/mock/public-gallery-data';

export type PhotosTabItem = {
  photos: PublicPhoto[];
  profileUsername: string;
  title?: string;
};

export type LikeTabItem = {
  photos: PublicPhoto[];
  profileUsername: string;
  title?: string;
};

export type PeopleTabItem = {
  people?: PublicProfileMini[];
};

export type AchievementsTabItem = {
  count: number;
};
