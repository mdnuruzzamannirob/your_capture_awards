export type ContestAccessTier = 'FREE' | 'PRO' | 'PREMIUM' | 'OPEN';

export type SubscriptionStatus = {
  pro: boolean;
  premium: boolean;
};

export type SubscriptionTier = 'FREE' | 'PRO' | 'PREMIUM';

export const STATIC_SUBSCRIPTION: SubscriptionStatus = {
  pro: false,
  premium: false,
};

const getRawContestTier = (contest: any) =>
  String(contest?.type ?? contest?.contestType ?? contest?.accessType ?? '')
    .trim()
    .toUpperCase();

export const isPaidContest = (contest: any) => {
  const tier = getRawContestTier(contest);
  const maxPrize = Number(contest?.maxPrize ?? 0);
  const minPrize = Number(contest?.minPrize ?? 0);

  return (
    ['PRO', 'PREMIUM'].includes(tier) ||
    contest?.isMoneyContest === true ||
    maxPrize > 0 ||
    minPrize > 0
  );
};

export const getContestTier = (contest: any): ContestAccessTier => {
  const tier = getRawContestTier(contest);

  if (['PRO', 'PREMIUM', 'OPEN', 'FREE'].includes(tier)) {
    return tier as ContestAccessTier;
  }

  if (isPaidContest(contest)) return 'PRO';

  return 'FREE';
};

export const canJoinContest = (contest: any, subscription = STATIC_SUBSCRIPTION) => {
  const tier = getContestTier(contest);
  const userTier = subscription.premium ? 'PREMIUM' : subscription.pro ? 'PRO' : 'FREE';

  if (tier === 'FREE' || tier === 'OPEN') return true;
  if (tier === 'PRO') return userTier === 'PRO' || userTier === 'PREMIUM';
  if (tier === 'PREMIUM') return userTier === 'PREMIUM';

  return false;
};

export const getUserSubscriptionTier = (user: any): SubscriptionTier => {
  const subscriptions = Array.isArray(user?.subscriptions) ? user.subscriptions : [];

  const validPlans = subscriptions
    .filter((item: any) => String(item?.status ?? '').toUpperCase() === 'VALID')
    .map((item: any) => String(item?.plan ?? '').toUpperCase());

  if (validPlans.includes('PREMIUM')) return 'PREMIUM';
  if (validPlans.includes('PRO')) return 'PRO';
  return 'FREE';
};

export const getUserSubscriptionStatus = (user: any): SubscriptionStatus => {
  const tier = getUserSubscriptionTier(user);

  return {
    pro: tier === 'PRO' || tier === 'PREMIUM',
    premium: tier === 'PREMIUM',
  };
};
