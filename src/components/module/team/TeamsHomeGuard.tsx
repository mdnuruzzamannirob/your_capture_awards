'use client';

import TeamsHeader from '@/components/layout/TeamsHeader';
import TeamMembershipLoading from '@/components/module/team/TeamMembershipLoading';
import { useTeamMembership } from '@/hooks/useTeamMembership';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TeamsHomeGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { isAuthenticated, isCheckingMembership, hasTeam } = useTeamMembership();

  useEffect(() => {
    if (isCheckingMembership) return;

    if (!isAuthenticated) {
      router.replace('/signin');
      return;
    }

    if (!hasTeam) {
      router.replace('/teams');
    }
  }, [hasTeam, isAuthenticated, isCheckingMembership, router]);

  if (isCheckingMembership || !hasTeam) {
    return <TeamMembershipLoading />;
  }

  return (
    <>
      <TeamsHeader />
      {children}
    </>
  );
}
