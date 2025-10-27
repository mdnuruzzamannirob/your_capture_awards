export type Photo = {
  states: unknown | null;
  url: string;
  id: string;
  userId: string;
  views: number;
  labels: unknown[];
  contestUpload: unknown[];
  title: string | null;
  description: string | null;
  adult: boolean;
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
  photos: Photo[] | null;
  stats: Stats | null;
  achievements: any | null;
};
