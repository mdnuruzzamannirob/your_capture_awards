export type ContestAccessTier = 'FREE' | 'PRO' | 'PREMIUM' | 'OPEN';

export type SubscriptionStatus = {
  pro: boolean;
  premium: boolean;
};

export const STATIC_SUBSCRIPTION: SubscriptionStatus = {
  pro: true,
  premium: false,
};

export const isPaidContest = (contest: any) => {
  const tier = String(contest?.contestType ?? contest?.type ?? contest?.accessType ?? '')
    .trim()
    .toUpperCase();

  return ['PRO', 'PREMIUM'].includes(tier);
};

export const getContestTier = (contest: any): ContestAccessTier => {
  const tier = String(contest?.contestType ?? contest?.type ?? contest?.accessType ?? '')
    .trim()
    .toUpperCase();

  if (['PRO', 'PREMIUM', 'OPEN', 'FREE'].includes(tier)) {
    return tier as ContestAccessTier;
  }

  return 'FREE';
};

export const canJoinContest = (contest: any, subscription = STATIC_SUBSCRIPTION) => {
  const tier = getContestTier(contest);

  if (tier === 'PRO') return subscription.pro;
  if (tier === 'PREMIUM') return subscription.premium;

  return true;
};
