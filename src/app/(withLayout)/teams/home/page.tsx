'use client';

import DisbandModal from '@/components/module/team/DisbandModal';
import EditTeamModal from '@/components/module/team/EditTeamModal';
import InviteModal from '@/components/module/team/InviteModal';
import JoinRequests from '@/components/module/team/JoinRequests';
import LeaveTeamDialog from '@/components/module/team/LeaveTeamDialog';
import MemberList from '@/components/module/team/MemberList';
import RemoveMemberDialog from '@/components/module/team/RemoveMemberDialog';
import TeamInfo from '@/components/module/team/TeamInfo';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { EditTeamValues } from '@/lib/schemas/teamSchema';
import {
  useApproveJoinRequestMutation,
  useAssignRoleMutation,
  useDeleteTeamMutation,
  useGetMyTeamQuery,
  useGetPendingRequestsQuery,
  useLeaveTeamMutation,
  useRejectJoinRequestMutation,
  useRemoveMemberMutation,
  useRevokeRoleMutation,
  useUpdateTeamMutation,
} from '@/store/apis/teamApi';
import { Accessibility, Role, TeamMember } from '@/types/team';
import { showErrorToast } from '@/utils/team-feedback';
import { getMemberName } from '@/utils/team-utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type JoinRequestViewModel = {
  id: string;
  requesterId?: string;
  requester?: {
    fullName: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
  };
  createdAt?: string;
};

export default function TeamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id || '';

  const {
    data: teamData,
    isLoading: isTeamLoading,
    isError: isTeamError,
    refetch,
  } = useGetMyTeamQuery();
  const { data: requestsData } = useGetPendingRequestsQuery(teamData?.data?.team?.id || '', {
    skip: !teamData?.data?.team?.id,
  });

  const [approveRequest] = useApproveJoinRequestMutation();
  const [rejectRequest] = useRejectJoinRequestMutation();
  const [assignRole] = useAssignRoleMutation();
  const [revokeRole] = useRevokeRoleMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [leaveTeam] = useLeaveTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();

  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [disbandOpen, setDisbandOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const team = teamData?.data?.team;
  const members: TeamMember[] = team?.members || [];
  const requests = (requestsData?.data || []) as JoinRequestViewModel[];

  const me = useMemo(
    () => members.find((m: TeamMember) => m.memberId === currentUserId),
    [members, currentUserId],
  );
  const isLeader = me?.level === 'LEADER';
  const isMod = me?.level === 'LEADER' || me?.level === 'MODERATOR';
  const leaveCandidates = useMemo(
    () => members.filter((member: TeamMember) => member.memberId !== currentUserId),
    [members, currentUserId],
  );

  const handleAcceptRequest = useCallback(
    async (req: { id: string }) => {
      try {
        await approveRequest(req.id).unwrap();
        toast.success('Request approved!');
      } catch (error) {
        showErrorToast(error, 'Failed to approve request');
      }
    },
    [approveRequest],
  );

  const handleDeclineRequest = useCallback(
    async (req: { id: string }) => {
      try {
        await rejectRequest(req.id).unwrap();
        toast.success('Request declined');
      } catch (error) {
        showErrorToast(error, 'Failed to reject request');
      }
    },
    [rejectRequest],
  );

  const handleChangeRole = useCallback(
    async (memberId: string, newRole: Role) => {
      if (!team) return;
      try {
        if (newRole === 'MEMBER') {
          await revokeRole({ teamId: team.id, memberId }).unwrap();
        } else {
          await assignRole({ teamId: team.id, memberId, level: newRole }).unwrap();
        }
        const target = members.find((m: TeamMember) => m.id === memberId);
        if (target)
          toast.success(`${getMemberName(target.member)} is now ${newRole.toLowerCase()}.`);
      } catch (error) {
        showErrorToast(error, 'Failed to assign role');
      }
    },
    [team, members, assignRole, revokeRole],
  );

  const handleRemoveMember = useCallback(
    async (target: TeamMember) => {
      if (!team) return;
      try {
        await removeMember({ teamId: team.id, memberId: target.id }).unwrap();
        setRemoveTarget(null);
        toast.success(`${getMemberName(target.member)} removed from team.`);
      } catch (error) {
        showErrorToast(error, 'Failed to remove member');
      }
    },
    [team, removeMember],
  );

  const handleTogglePrivacy = useCallback(async () => {
    if (!team) return;
    try {
      const newAccessibility: Accessibility =
        team.accessibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
      await updateTeam({
        teamId: team.id,
        data: { accessibility: newAccessibility },
      }).unwrap();
      toast.success(`Team is now ${newAccessibility === 'PUBLIC' ? 'public' : 'private'}.`);
    } catch (error) {
      showErrorToast(error, 'Failed to update team privacy');
    }
  }, [team, updateTeam]);

  const handleLeaveTeamWithTransfer = useCallback(
    async (memberId?: string) => {
      if (!team) return;
      if (isLeader && !memberId) {
        toast.error('Select a member to transfer leadership before leaving.');
        return;
      }

      try {
        await leaveTeam({ teamId: team.id, memberId }).unwrap();
        toast.success('You left the team.');
        setLeaveOpen(false);
        router.push('/teams');
      } catch (error) {
        showErrorToast(error, 'Failed to leave team');
      }
    },
    [isLeader, leaveTeam, router, team],
  );

  const handleEditTeam = useCallback(
    async (values: EditTeamValues & { badgeFile?: File | null; badgePreview?: string | null }) => {
      if (!team) return;
      try {
        await updateTeam({
          teamId: team.id,
          data: (() => {
            const payload = new FormData();
            payload.append('name', values.name);
            payload.append('description', values.description || '');
            payload.append('language', values.language);
            payload.append('country', values.country);
            payload.append('min_requirement', values.min_requirement);
            if (values.badgeFile) {
              payload.append('badge', values.badgeFile);
            }
            return payload;
          })(),
        }).unwrap();
        toast.success('Team info updated!');
        setEditOpen(false);
      } catch (error) {
        showErrorToast(error, 'Failed to update team');
      }
    },
    [team, updateTeam],
  );

  const handleDisband = useCallback(async () => {
    if (!team) return;
    try {
      await deleteTeam(team.id).unwrap();
      toast.success('Team disbanded.');
      setDisbandOpen(false);
      router.push('/teams');
    } catch (error) {
      showErrorToast(error, 'Failed to disband team');
    }
  }, [team, deleteTeam, router]);

  const winRate = team?.total_matches ? Math.round((team.win / team.total_matches) * 100) : 0;

  useEffect(() => {
    if (isTeamLoading || isTeamError) return;
    if (!team) {
      router.replace('/teams');
    }
  }, [isTeamError, isTeamLoading, router, team]);

  if (isTeamLoading) {
    return (
      <section className="margin-user container space-y-6 py-6" aria-busy="true" aria-live="polite">
        <div className="rounded-xl border p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="size-18 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-6 w-40" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-36" />
                <Skeleton className="h-7 w-28" />
              </div>
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
            <Skeleton className="h-9 w-10 rounded-md" />
          </div>
          <div className="my-5">
            <Skeleton className="h-px w-full" />
          </div>
          <Skeleton className="mb-3 h-4 w-28" />
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="rounded-xl border p-5">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-16" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-7 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isTeamError) {
    return (
      <section className="margin-user container space-y-6 py-6">
        <div className="rounded-xl border p-6 text-center">
          <p className="font-semibold">Failed to load team data</p>
          <p className="text-muted-foreground mt-1 text-sm">Try again to refresh the team view.</p>
          <Button className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (!team) {
    return (
      <section className="margin-user container space-y-6 py-6">
        <div className="flex h-96 items-center justify-center">
          <p className="text-muted-foreground">Team not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="margin-user container space-y-6 py-6">
      <TeamInfo
        team={team}
        winRate={winRate}
        isLeader={isLeader}
        onEdit={() => setEditOpen(true)}
        onTogglePrivacy={handleTogglePrivacy}
        onLeave={() => setLeaveOpen(true)}
        onDisband={() => setDisbandOpen(true)}
      />

      {isMod && requests.length > 0 && (
        <JoinRequests
          requests={requests.map((req: (typeof requests)[number]) => ({
            id: req.id,
            memberId: req.requesterId ?? req.id,
            member: {
              fullName:
                req.requester?.fullName ||
                `${req.requester?.firstName ?? ''} ${req.requester?.lastName ?? ''}`.trim(),
              avatar: req.requester?.avatar ?? null,
            },
            requestedAt: req.createdAt ?? new Date().toISOString(),
          }))}
          onAccept={handleAcceptRequest}
          onDecline={handleDeclineRequest}
        />
      )}

      <MemberList
        members={members}
        currentUserId={currentUserId}
        isLeader={isLeader}
        isMod={isMod}
        onChangeRole={handleChangeRole}
        onRemove={setRemoveTarget}
        onInvite={() => setInviteOpen(true)}
      />

      <EditTeamModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        team={team}
        onSave={handleEditTeam}
      />

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} teamId={team.id} />

      <DisbandModal
        open={disbandOpen}
        onClose={() => setDisbandOpen(false)}
        teamName={team.name}
        onDisband={handleDisband}
      />

      <LeaveTeamDialog
        open={leaveOpen}
        onClose={() => setLeaveOpen(false)}
        teamName={team.name}
        currentUserId={currentUserId}
        members={leaveCandidates}
        isLeader={isLeader}
        onLeave={handleLeaveTeamWithTransfer}
      />

      <RemoveMemberDialog
        target={removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemoveMember}
      />
    </section>
  );
}
