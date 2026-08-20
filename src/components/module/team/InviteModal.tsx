'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useGetTeamInvitationsQuery, useInviteMemberMutation } from '@/store/apis/teamApi';
import { useLazySearchUsersQuery } from '@/store/apis/userApi';
import { TeamMember } from '@/types/team';
import { getErrorMessage, showErrorToast } from '@/utils/team-feedback';
import { Check, Search, Send, UserX } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

interface InviteUser {
  id: string;
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  username?: string | null;
}

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
  members: TeamMember[];
  hasSlots: boolean;
}

function getUserName(user: InviteUser) {
  return user.fullName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unnamed user';
}

function getInitials(user: InviteUser) {
  return getUserName(user)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function InviteModal({ open, onClose, teamId, members, hasSlots }: InviteModalProps) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<InviteUser[]>([]);
  const [sentUserIds, setSentUserIds] = useState<Set<string>>(() => new Set());
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchUsers, { isFetching }] = useLazySearchUsersQuery();
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();
  const { data: invitationsData, isFetching: isInvitationsFetching } = useGetTeamInvitationsQuery(
    teamId,
    { skip: !open || !teamId },
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const memberIds = useMemo(() => {
    const ids = new Set<string>();
    members.forEach((member) => {
      ids.add(member.memberId);
      if (member.member?.id) ids.add(member.member.id);
    });
    return ids;
  }, [members]);

  const availableUsers = useMemo(
    () => users.filter((user) => !memberIds.has(user.id)),
    [memberIds, users],
  );

  const invitedUserIds = useMemo(() => {
    const ids = new Set(sentUserIds);
    invitationsData?.data?.forEach((invitation) => {
      ids.add(invitation.receiverId);
    });
    return ids;
  }, [invitationsData?.data, sentUserIds]);

  const loadUsers = useCallback(
    async (searchTerm: string) => {
      setError(null);
      try {
        const response = await searchUsers({
          query: searchTerm.trim(),
          page: 1,
          limit: 50,
        }).unwrap();
        setUsers(response.data?.users ?? []);
      } catch {
        setUsers([]);
        setError('Unable to load users.');
      }
    },
    [searchUsers],
  );

  useEffect(() => {
    if (!open) return;

    setQuery('');
    setUsers([]);
    setSentUserIds(new Set());
    setError(null);
    void loadUsers('');
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [loadUsers, open]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void loadUsers(value);
    }, 300);
  };

  const handleInvite = async (user: InviteUser) => {
    if (!hasSlots) {
      toast.error('This team has no open member slots.');
      return;
    }

    setActiveUserId(user.id);
    try {
      await inviteMember({ teamId, userId: user.id }).unwrap();
      setSentUserIds((current) => new Set(current).add(user.id));
      toast.success(`Invitation sent to ${getUserName(user)}.`);
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to send invitation');
      if (message.toLowerCase().includes('active invitation')) {
        setSentUserIds((current) => new Set(current).add(user.id));
        return;
      }

      showErrorToast(error, 'Failed to send invitation');
    } finally {
      setActiveUserId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Search users and send an invitation to players who are not already on this team.
          </DialogDescription>
        </DialogHeader>

        {!hasSlots && (
          <div className="border-warning/30 bg-warning/10 text-warning rounded-md border px-3 py-2 text-sm">
            This team is full. Invitations will be available again when a member slot opens.
          </div>
        )}

        <div className="border-border bg-surface-secondary/80 flex items-center gap-2 rounded-md border px-3">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search users"
            className="border-0 bg-transparent px-0 focus-visible:ring-0"
          />
        </div>

        <div className="max-h-80 overflow-y-auto rounded-lg border">
          {error ? (
            <div className="text-destructive p-6 text-center text-sm">{error}</div>
          ) : (isFetching || isInvitationsFetching) && availableUsers.length === 0 ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 p-6 text-sm">
              <Spinner /> Loading users...
            </div>
          ) : availableUsers.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center gap-2 p-6 text-center text-sm">
              <UserX className="size-6" />
              {query.trim() ? 'No available users found.' : 'No available users to invite.'}
            </div>
          ) : (
            <div className="divide-y">
              {availableUsers.map((user) => {
                const name = getUserName(user);
                const isSent = invitedUserIds.has(user.id);
                const isActive = activeUserId === user.id;

                return (
                  <div key={user.id} className="flex items-center gap-3 px-3 py-3">
                    <Avatar className="size-9 shrink-0">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} className="object-cover" />
                      ) : null}
                      <AvatarFallback className="bg-surface-secondary text-[11px] font-semibold">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{name}</p>
                      {user.username ? (
                        <p className="text-muted-foreground truncate text-xs">@{user.username}</p>
                      ) : null}
                    </div>

                    <Button
                      type="button"
                      variant={isSent ? 'outline' : 'default'}
                      size="sm"
                      className="h-8 min-w-36 shrink-0 text-xs"
                      disabled={!hasSlots || isSent || isInviting}
                      onClick={() => handleInvite(user)}
                    >
                      {isActive ? (
                        <Spinner className="size-3.5" />
                      ) : isSent ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Send className="size-3.5" />
                      )}
                      {isSent ? 'Invitation already sent' : 'Invite'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InviteModal;
