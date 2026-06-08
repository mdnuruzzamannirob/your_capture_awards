export type PhotoToContestPayload = {
  photo?: File;
  photoIds?: string[];
  contestId: string;
};

export type Status = 'COMPLETED' | 'UPCOMING' | 'CLOSED' | 'ACTIVE';
export type ContestPayload = {
  page?: number;
  limit?: number;
  q?: string;
  status?: Status;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ContestState = {
  joined: [];
  completed: [];
  open: [];
  upcoming: [];
  closed: [];
};
