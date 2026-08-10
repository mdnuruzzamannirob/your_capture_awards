export type ContestUpload = {
  achievements?: unknown[];
  _count?: {
    votes?: number;
  };
};

export type Photo = {
  states: unknown | null;
  url: string;
  id: string;
  userId: string;
  views: number;
  labels: unknown[];
  contestUpload: ContestUpload[];
  title: string | null;
  description: string | null;
  adult: boolean;
  createdAt: string;
  updatedAt: string;
  likes: number;
  totalVotes: number;
};

export type Stats = {
  followers: number;
  followings: number;
  likes: number;
  userPhotos: number;
  achievements: number;
};

export type AchievementCard = {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  date: string;
  earnedAt?: string;
  photoId?: string | null;
  contestPhotoId?: string | null;
  contestId?: string | null;
  category?: string;
};

export type ProfileAchievementBadge = {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
  count: number;
  cards: AchievementCard[];
};

export type ProfileAchievementGroup = {
  key: 'ultimate' | 'ranking';
  label: string;
  badges: ProfileAchievementBadge[];
};

export type ProfileAchievementsResponse = {
  success: boolean;
  message: string;
  data: {
    totalAchievements: number;
    groups: ProfileAchievementGroup[];
  };
};

export type ProfileState = {
  photos: Photo[];
  stats: Stats | null;
  swiperPhotos: any[];
  achievements: any | null;
};
