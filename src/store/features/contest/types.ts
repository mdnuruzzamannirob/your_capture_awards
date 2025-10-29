export type PhotoToContestPayload = {
  photo?: FormData;
  photoId?: string;
  contestId: string;
};

export type ContestPayload = {
  page?: number;
  limit?: number;
  q?: string;
  status?: 'COMPLETED' | 'UPCOMING' | 'CLOSED' | 'ACTIVE';
};

export type ContestState = {
  joined: [];
  completed: [];
  open: [];
  upcoming: [];
  closed: [];
};
