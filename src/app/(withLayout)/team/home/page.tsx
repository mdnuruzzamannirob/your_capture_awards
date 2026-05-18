'use client';

import { CURRENT_USER_ID, initialMembers, initialRequests, initialTeam } from "@/lib/mock/team";
import { EditTeamValues, TeamSettingsValues } from "@/lib/schemas/teamSchema";
import { Accessibility, JoinRequest, Role, TeamData, TeamMember } from "@/types/team";
import { getMemberName } from "@/utils/team-utils";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import MemberList from "@/components/module/team/MemberList";
import RemoveMemberDialog from "@/components/module/team/RemoveMemberDialog";
import LeaveTeamDialog from "@/components/module/team/LeaveTeamDialog";
import DisbandModal from "@/components/module/team/DisbandModal";
import TransferModal from "@/components/module/team/TransferModal";
import EditTeamModal from "@/components/module/team/EditTeamModal";
import ManageTeam from "@/components/module/team/ManageTeam";
import TeamSettingsModal from "@/components/module/team/TeamSettingsModal";
import InviteModal from "@/components/module/team/InviteModal";
import JoinRequests from "@/components/module/team/JoinRequests";
import TeamInfo from "@/components/module/team/TeamInfo";

export default function TeamPage() {
  const [team, setTeam] = useState<TeamData>(initialTeam);
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [requests, setRequests] = useState<JoinRequest[]>(initialRequests);

  // Derived permissions
  const me = members.find((m) => m.memberId === CURRENT_USER_ID);
  const isLeader = me?.level === 'LEADER';
  const isMod = me?.level === 'LEADER' || me?.level === 'MODERATOR';

  // Modal open states
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [disbandOpen, setDisbandOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);

  // ── Handlers (replace bodies with API calls) ──────────────────────────────

  const handleAcceptRequest = useCallback(
    (req: JoinRequest) => {
      // TODO: POST /api/teams/${team.id}/requests/${req.id}/accept
      const newMember: TeamMember = {
        id: `m-${Date.now()}`,
        memberId: req.memberId,
        level: 'MEMBER',
        status: 'ACTIVE',
        teamId: team.id,
        createdAt: 'Just now',
        member: {
          id: req.memberId,
          fullName: req.member.fullName,
          firstName: req.member.fullName.split(' ')[0] ?? '',
          lastName: req.member.fullName.split(' ')[1] ?? '',
          avatar: req.member.avatar,
        },
      };
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      setMembers((prev) => [...prev, newMember]);
      setTeam((prev) => ({ ...prev, member_count: prev.member_count + 1 }));
      toast.success(`${req.member.fullName} joined the team!`);
    },
    [team.id],
  );

  const handleDeclineRequest = useCallback((req: JoinRequest) => {
    // TODO: POST /api/teams/${team.id}/requests/${req.id}/decline
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    toast.error(`${req.member.fullName} was declined.`);
  }, []);

  const handleChangeRole = useCallback(
    (memberRowId: string, newRole: Role) => {
      // TODO: PATCH /api/teams/${team.id}/members/${memberRowId}  body: { level: newRole }
      setMembers((prev) => prev.map((m) => (m.id === memberRowId ? { ...m, level: newRole } : m)));
      const target = members.find((m) => m.id === memberRowId);
      if (target) toast.success(`${getMemberName(target.member)} is now ${newRole.toLowerCase()}.`);
    },
    [members],
  );

  const handleRemoveMember = useCallback((target: TeamMember) => {
    // TODO: DELETE /api/teams/${team.id}/members/${target.memberId}
    setMembers((prev) => prev.filter((m) => m.id !== target.id));
    setTeam((prev) => ({ ...prev, member_count: prev.member_count - 1 }));
    setRemoveTarget(null);
    toast.success(`${getMemberName(target.member)} removed from team.`);
  }, []);

  const handleLeaveTeam = useCallback(() => {
    // TODO: DELETE /api/teams/${team.id}/members/me
    toast.success('You left the team.');
    setLeaveOpen(false);
    // router.push("/teams")
  }, []);

  const handleTogglePrivacy = useCallback(() => {
    // TODO: PATCH /api/teams/${team.id}  body: { accessibility: newVal }
    const next: Accessibility = team.accessibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    setTeam((prev) => ({ ...prev, accessibility: next }));
    toast.success(`Team is now ${next === 'PUBLIC' ? 'public' : 'private'}.`);
  }, [team.accessibility]);

  const handleTransfer = useCallback(
    (targetMemberRowId: string) => {
      // TODO: POST /api/teams/${team.id}/transfer  body: { newLeaderMemberRowId: targetMemberRowId }
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === targetMemberRowId) return { ...m, level: 'LEADER' as Role };
          if (m.memberId === CURRENT_USER_ID) return { ...m, level: 'MEMBER' as Role };
          return m;
        }),
      );
      const target = members.find((m) => m.id === targetMemberRowId);
      if (target) toast.success(`${getMemberName(target.member)} is now the leader!`);
      setTransferOpen(false);
    },
    [members],
  );

  const handleEditTeam = useCallback(
    (values: EditTeamValues & { badgeFile?: File | null; badgePreview?: string | null }) => {
      // TODO: PATCH /api/teams/${team.id}
      //   if (values.badgeFile) → multipart/form-data
      //   else                  → application/json
      setTeam((prev) => ({
        ...prev,
        name: values.name,
        description: values.description ?? prev.description,
        language: values.language,
        country: values.country,
        badge: values.badgePreview ?? prev.badge,
      }));
      toast.success('Team info updated!');
      setEditOpen(false);
    },
    [],
  );

  const handleSaveSettings = useCallback(
    (values: TeamSettingsValues) => {
      // TODO: PATCH /api/teams/${team.id}/settings
      if (values.member_slots < team.member_count) {
        toast.error("Slots can't be less than current member count.");
        return;
      }
      setTeam((prev) => ({ ...prev, ...values }));
      toast.success('Team settings saved!');
      setSettingsOpen(false);
    },
    [team.member_count],
  );

  const handleDisband = useCallback(() => {
    // TODO: DELETE /api/teams/${team.id}
    toast.error('Team disbanded.');
    setDisbandOpen(false);
    // router.push("/teams")
  }, []);

  // Derived stats
  const winRate = team.total_matches > 0 ? Math.round((team.win / team.total_matches) * 100) : 0;
  const slotPct = Math.round((team.member_count / team.member_slots) * 100);

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
          requests={requests}
          onAccept={handleAcceptRequest}
          onDecline={handleDeclineRequest}
        />
      )}

      {/* ── Member List ───────────────────────────────────────────────── */}
      <MemberList
        members={members}
        currentUserId={CURRENT_USER_ID}
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
        members={members.filter((m) => m.memberId !== CURRENT_USER_ID)}
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
