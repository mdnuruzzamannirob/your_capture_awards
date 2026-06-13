export interface DiscoverPhotoItem {
  id: string;
  category: string;
  photoId: string;
  participantId: string;
  contestId: string;
  createdAt: string;
  updatedAt: string;
  photo: {
    id: string;
    photo: {
      id: string;
      url: string;
      likes: string[];
      views: number;
    };
  };
  participant: {
    user: {
      id: string;
      cover: string | null;
      avatar: string | null;
      socialId: string | null;
      socialProvider: string | null;
      firstName: string;
      lastName: string;
      fullName: string;
      username: string | null;
      phone: string;
      email: string;
      location: string;
      country: string | null;
      customerId: string;
      role: string;
      isActive: boolean;
      isBlocked: boolean;
      isDeleted: boolean;
      currentLevel: number;
      voting_power: number;
      purchased_plan: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
  voteCount: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DiscoverPhotosResponse {
  success: boolean;
  message: string;
  meta: PaginationMeta;
  data: DiscoverPhotoItem[];
}
