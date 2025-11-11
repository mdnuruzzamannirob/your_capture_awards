export type PhotoToContestPayload = {
  photo?: File;
  photoId?: string | string[];
  contestId: string;
};

export type Status = 'COMPLETED' | 'UPCOMING' | 'CLOSED' | 'ACTIVE';
export type ContestPayload = {
  page?: number;
  limit?: number;
  q?: string;
  status?: Status;
};

export type ContestState = {
  joined: [];
  completed: [];
  open: [];
  upcoming: [];
  closed: [];
};
