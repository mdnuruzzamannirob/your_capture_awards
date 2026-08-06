import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';

export interface LevelRequirement {
  type?: string;
  title?: string;
  badge?: string;
  required: number;
  current?: number;
  percentage?: number;
  progressPercentage?: number;
  satisfied?: boolean;
}

export interface Level {
  id: string;
  level: number;
  levelName: string;
  order: number;
  requirements: LevelRequirement[];
  createdAt: string;
  updatedAt: string;
}

export interface LevelsResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
  data: Level[];
}

export interface UserProgressRequirement {
  type?: string;
  title?: string;
  badge?: string;
  required: number;
  current: number;
  percentage?: number;
  progressPercentage?: number;
  satisfied?: boolean;
}

export interface UserProgress {
  currentStatus: {
    name: string;
    order: number;
    votingPower: number;
    receivedVotes: number;
    receivedVoteCount: number;
    promotedVotes: number;
    promotedVoteCount: number;
    badges: Record<string, number>;
  };
  nextLevel: {
    name: string;
    order: number;
    requirements: UserProgressRequirement[];
  } | null;
  levels: Array<{
    order: number;
    name: string;
    votePower: number;
    eligible: boolean;
    requirements: UserProgressRequirement[];
  }>;
}

export interface UserProgressResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserProgress;
}

export const levelsApi = createApi({
  reducerPath: 'levelsApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Levels', 'UserProgress'],
  endpoints: (builder) => ({
    // GET /api/v1/levels?page=1&limit=50
    getAllLevels: builder.query<LevelsResponse, { page?: number; limit?: number } | void>({
      query: (params) => {
        const page = (params as any)?.page ?? 1;
        const limit = (params as any)?.limit ?? 50;
        return `/levels?page=${page}&limit=${limit}`;
      },
      providesTags: ['Levels'],
    }),

    // GET /api/v1/users/progress
    getUserProgress: builder.query<UserProgressResponse, void>({
      query: () => '/users/progress',
      providesTags: ['UserProgress'],
    }),
  }),
});

export const { useGetAllLevelsQuery, useGetUserProgressQuery } = levelsApi;
