'use client';

import DisbandModal from '@/components/module/team/DisbandModal';
import EditTeamModal from '@/components/module/team/EditTeamModal';
import InviteModal from '@/components/module/team/InviteModal';
import JoinRequests from '@/components/module/team/JoinRequests';
import LeaveTeamDialog from '@/components/module/team/LeaveTeamDialog';
import ManageTeam from '@/components/module/team/ManageTeam';
import MemberList from '@/components/module/team/MemberList';
import RemoveMemberDialog from '@/components/module/team/RemoveMemberDialog';
import TeamInfo from '@/components/module/team/TeamInfo';
import TeamSettingsModal from '@/components/module/team/TeamSettingsModal';
import TransferModal from '@/components/module/team/TransferModal';
import { useAuth } from '@/hooks/useAuth';
import { EditTeamValues, TeamSettingsValues } from '@/lib/schemas/teamSchema';
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
import { Accessibility, JoinRequest, Role, TeamMember } from '@/store/types/teamTypes';
import { getMemberName } from '@/utils/team-utils';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function TeamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id || '';

  // ── API Calls ────────────────────────────────────────────────────────
  const { data: teamData, isLoading: isTeamLoading } = useGetMyTeamQuery();
  const { data: requestsData } = useGetPendingRequestsQuery(teamData?.data?.team?.id || '', {
    skip: !teamData?.data?.team?.id,
  });

  // ── Mutations ────────────────────────────────────────────────────────
  const [approveRequest] = useApproveJoinRequestMutation();
  const [rejectRequest] = useRejectJoinRequestMutation();
  const [assignRole] = useAssignRoleMutation();
  const [revokeRole] = useRevokeRoleMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [leaveTeam] = useLeaveTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();

  // ── Local State ──────────────────────────────────────────────────────
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);

  // Modal open states
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [disbandOpen, setDisbandOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  // ── Derived Data ─────────────────────────────────────────────────────
  const team = teamData?.data?.team;
  const members = teamData?.data?.members || [];
  const requests = requestsData?.data || [];

  const me = useMemo(
    () => members.find((m) => m.memberId === currentUserId),
    [members, currentUserId],
  );
  const isLeader = me?.level === 'LEADER';
  const isMod = me?.level === 'LEADER' || me?.level === 'MODERATOR';

  // ── Handlers ─────────────────────────────────────────────────────────

  const handleAcceptRequest = useCallback(
    async (req: JoinRequest) => {
      try {
        await approveRequest(req.id).unwrap();
        toast.success('Request approved!');
      } catch (error) {
        console.error('Failed to approve request:', error);
        toast.error('Failed to approve request');
      }
    },
    [approveRequest],
  );

  const handleDeclineRequest = useCallback(
    async (req: JoinRequest) => {
      try {
        await rejectRequest(req.id).unwrap();
        toast.error('Request declined');
      } catch (error) {
        console.error('Failed to reject request:', error);
        toast.error('Failed to reject request');
      }
    },
    [rejectRequest],
  );

  const handleChangeRole = useCallback(
    async (memberId: string, newRole: Role) => {
      if (!team) return;
      try {
        await assignRole({ teamId: team.id, memberId, level: newRole }).unwrap();
        const target = members.find((m) => m.id === memberId);
        if (target)
          toast.success(`${getMemberName(target.member)} is now ${newRole.toLowerCase()}.`);
      } catch (error) {
        console.error('Failed to assign role:', error);
        toast.error('Failed to assign role');
      }
    },
    [team, members, assignRole],
  );

  const handleRemoveMember = useCallback(
    async (target: TeamMember) => {
      if (!team) return;
      try {
        await removeMember({ teamId: team.id, memberId: target.memberId }).unwrap();
        setRemoveTarget(null);
        toast.success(`${getMemberName(target.member)} removed from team.`);
      } catch (error) {
        console.error('Failed to remove member:', error);
        toast.error('Failed to remove member');
      }
    },
    [team, removeMember],
  );

  const handleLeaveTeam = useCallback(async () => {
    try {
      await leaveTeam({ teamId: team.id }).unwrap();
      toast.success('You left the team.');
      setLeaveOpen(false);
      router.push('/teams');
    } catch (error) {
      console.error('Failed to leave team:', error);
      toast.error('Failed to leave team');
    }
  }, [leaveTeam, router]);

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
      console.error('Failed to toggle privacy:', error);
      toast.error('Failed to update team privacy');
    }
  }, [team, updateTeam]);

  const handleTransfer = useCallback(
    async (targetMemberId: string) => {
      if (!team) return;
      try {
        // First assign leader role to new leader
        await assignRole({ teamId: team.id, memberId: targetMemberId, level: 'LEADER' }).unwrap();
        // Then revoke leader role from current user
        if (me) {
          await revokeRole({ teamId: team.id, memberId: me.memberId }).unwrap();
        }
        const target = members.find((m) => m.id === targetMemberId);
        if (target) toast.success(`${getMemberName(target.member)} is now the leader!`);
        setTransferOpen(false);
      } catch (error) {
        console.error('Failed to transfer leadership:', error);
        toast.error('Failed to transfer leadership');
      }
    },
    [team, me, members, assignRole, revokeRole],
  );

  const handleEditTeam = useCallback(
    async (values: EditTeamValues & { badgeFile?: File | null; badgePreview?: string | null }) => {
      if (!team) return;
      try {
        await updateTeam({
          teamId: team.id,
          data: {
            name: values.name,
            description: values.description,
            language: values.language,
            country: values.country,
            // Note: Badge upload would require multipart/form-data handling
            // For now, only basic fields are updated
          },
        }).unwrap();
        toast.success('Team info updated!');
        setEditOpen(false);
      } catch (error) {
        console.error('Failed to update team:', error);
        toast.error('Failed to update team');
      }
    },
    [team, updateTeam],
  );

  const handleSaveSettings = useCallback(
    async (values: TeamSettingsValues) => {
      if (!team) return;
      try {
        if (values.member_slots < team.member_count) {
          toast.error("Slots can't be less than current member count.");
          return;
        }
        await updateTeam({
          teamId: team.id,
          data: {
            member_slots: values.member_slots,
            min_requirement: values.min_requirement,
            skill_level: values.skill_level,
          },
        }).unwrap();
        toast.success('Team settings saved!');
        setSettingsOpen(false);
      } catch (error) {
        console.error('Failed to save settings:', error);
        toast.error('Failed to save settings');
      }
    },
    [team, updateTeam],
  );

  const handleDisband = useCallback(async () => {
    if (!team) return;
    try {
      await deleteTeam(team.id).unwrap();
      toast.error('Team disbanded.');
      setDisbandOpen(false);
      router.push('/teams');
    } catch (error) {
      console.error('Failed to disband team:', error);
      toast.error('Failed to disband team');
    }
  }, [team, deleteTeam, router]);

  // ── Derived Stats ────────────────────────────────────────────────────
  const winRate = team?.total_matches ? Math.round((team.win / team.total_matches) * 100) : 0;
  const slotPct = team ? Math.round((team.member_count / team.member_slots) * 100) : 0;

  if (isTeamLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Loading team data...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Team not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Team Info ────────────────────────────────────────────────────── */}
      <TeamInfo
        team={team}
        winRate={winRate}
        slotPct={slotPct}
        isLeader={isLeader}
        onEdit={() => setEditOpen(true)}
      />

      {/* ── Join Requests (moderator / leader only) ───────────────────── */}
      {isMod && requests.length > 0 && (
        <JoinRequests
          requests={requests.map((req) => ({
            id: req.id,
            memberId: req.requesterId,
            member: {
              fullName:
                req.requester.fullName ||
                `${req.requester.firstName} ${req.requester.lastName}`.trim(),
              avatar: req.requester.avatar,
            },
            requestedAt: req.createdAt,
          }))}
          onAccept={handleAcceptRequest}
          onDecline={handleDeclineRequest}
        />
      )}

      {/* ── Member List ───────────────────────────────────────────────── */}
      <MemberList
        members={members}
        currentUserId={currentUserId}
        isLeader={isLeader}
        isMod={isMod}
        onChangeRole={handleChangeRole}
        onRemove={setRemoveTarget}
        onLeave={() => setLeaveOpen(true)}
        onInvite={() => setInviteOpen(true)}
      />

      {/* ── Manage Team (leader only) ─────────────────────────────────── */}
      {isLeader && (
        <ManageTeam
          team={team}
          onSettings={() => setSettingsOpen(true)}
          onTransfer={() => setTransferOpen(true)}
          onTogglePrivacy={handleTogglePrivacy}
          onDisband={() => setDisbandOpen(true)}
        />
      )}

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <EditTeamModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        team={team}
        onSave={handleEditTeam}
      />

      <TeamSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        team={team}
        onSave={handleSaveSettings}
      />

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} teamId={team.id} />

      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        members={members.filter((m) => m.memberId !== currentUserId)}
        onTransfer={handleTransfer}
      />

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
        onLeave={handleLeaveTeam}
      />

      <RemoveMemberDialog
        target={removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemoveMember}
      />
    </div>
  );
}
