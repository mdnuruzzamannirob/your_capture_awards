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

export type ProfileState = {
  photos: Photo[];
  stats: Stats | null;
  achievements: any | null;
};
