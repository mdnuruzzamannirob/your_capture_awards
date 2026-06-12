'use client';

import { useAuth } from '@/hooks/useAuth';
import { useGetMyTeamQuery } from '@/store/apis/teamApi';
import type { TeamData } from '@/store/types/teamTypes';

export function useTeamMembership() {
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    data,
    isLoading: isTeamLoading,
    isFetching,
    isError,
  } = useGetMyTeamQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const team: TeamData | null = data?.data?.team?.id ? data.data.team : null;
  const hasTeam = Boolean(team?.id);

  const isCheckingMembership =
    isAuthenticated && (isAuthLoading || isTeamLoading || (isFetching && !hasTeam && !isError));

  return {
    token,
    isAuthenticated,
    isCheckingMembership,
    hasTeam,
    team,
    teamData: data,
    isTeamLoading,
    isTeamError: isError,
  };
}
