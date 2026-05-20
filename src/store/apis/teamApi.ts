import { baseQuery } from '@/store/baseQuery';
import {
  ApproveRequestResponse,
  AssignRoleResponse,
  DeleteTeamResponse,
  GetMyTeamResponse,
  GetPendingRequestsResponse,
  GetTeamMembersResponse,
  InviteMemberResponse,
  LeaveTeamResponse,
  RejectRequestResponse,
  RemoveMemberResponse,
  RevokeRoleResponse,
  UpdateTeamRequest,
  UpdateTeamResponse,
} from '@/store/types/teamTypes';
import { createApi } from '@reduxjs/toolkit/query/react';

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Team', 'TeamMembers', 'JoinRequests', 'TeamInvitations'],
  endpoints: (builder) => ({
    // ── Get Team Data ─────────────────────────────────────────────────────
    getMyTeam: builder.query<GetMyTeamResponse, void>({
      query: () => ({
        url: '/teams/my-team',
        method: 'GET',
      }),
      providesTags: ['Team', 'TeamMembers'],
    }),

    // ── Get Team Members ──────────────────────────────────────────────────
    getTeamMembers: builder.query<GetTeamMembersResponse, string>({
      query: (teamId) => ({
        url: `/teams/members/${teamId}`,
        method: 'GET',
      }),
      providesTags: ['TeamMembers'],
    }),

    // ── Invite Member ─────────────────────────────────────────────────────
    inviteMember: builder.mutation<InviteMemberResponse, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: '/teams/invite',
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ['TeamInvitations'],
    }),

    // ── Remove Member from Team ───────────────────────────────────────────
    removeMember: builder.mutation<RemoveMemberResponse, { teamId: string; memberId: string }>({
      query: ({ teamId, memberId }) => ({
        url: '/teams/remove',
        method: 'POST',
        body: { memberId },
      }),
      invalidatesTags: ['TeamMembers', 'Team'],
    }),

    // ── Assign Role to Member (Promote) ───────────────────────────────────
    assignRole: builder.mutation<
      AssignRoleResponse,
      { teamId: string; memberId: string; level: string }
    >({
      query: ({ teamId, memberId, level }) => ({
        url: `/teams/${teamId}/members/${memberId}/assign-role`,
        method: 'POST',
        body: { role: level },
      }),
      invalidatesTags: ['TeamMembers'],
    }),

    // ── Revoke Role from Member ───────────────────────────────────────────
    revokeRole: builder.mutation<RevokeRoleResponse, { teamId: string; memberId: string }>({
      query: ({ teamId, memberId }) => ({
        url: `/teams/${teamId}/members/${memberId}/revoke-role`,
        method: 'POST',
      }),
      invalidatesTags: ['TeamMembers'],
    }),

    // ── Update Team ───────────────────────────────────────────────────────
    updateTeam: builder.mutation<UpdateTeamResponse, { teamId: string; data: UpdateTeamRequest }>({
      query: ({ teamId, data }) => ({
        url: `/teams/${teamId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Team'],
    }),

    // ── Get Pending Join Requests ─────────────────────────────────────────
    getPendingRequests: builder.query<GetPendingRequestsResponse, string>({
      query: (teamId) => ({
        url: `/teams/request/pending/${teamId}`,
        method: 'GET',
      }),
      providesTags: ['JoinRequests'],
    }),

    // ── Approve Join Request ──────────────────────────────────────────────
    approveJoinRequest: builder.mutation<ApproveRequestResponse, string>({
      query: (joinRequestId) => ({
        url: `/teams/request/approve/${joinRequestId}`,
        method: 'POST',
      }),
      invalidatesTags: ['JoinRequests', 'TeamMembers', 'Team'],
    }),

    // ── Reject Join Request ───────────────────────────────────────────────
    rejectJoinRequest: builder.mutation<RejectRequestResponse, string>({
      query: (joinRequestId) => ({
        url: `/teams/request/reject/${joinRequestId}`,
        method: 'POST',
      }),
      invalidatesTags: ['JoinRequests'],
    }),

    // ── Leave Team ────────────────────────────────────────────────────────
    leaveTeam: builder.mutation<LeaveTeamResponse, { teamId: string }>({
      query: ({ teamId }) => ({
        url: '/teams/leave',
        method: 'POST',
        body: { teamId },
      }),
      invalidatesTags: ['Team', 'TeamMembers'],
    }),

    // ── Delete Team ───────────────────────────────────────────────────────
    deleteTeam: builder.mutation<DeleteTeamResponse, string>({
      query: (teamId) => ({
        url: `/teams/${teamId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team', 'TeamMembers'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetMyTeamQuery,
  useGetTeamMembersQuery,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useAssignRoleMutation,
  useRevokeRoleMutation,
  useUpdateTeamMutation,
  useGetPendingRequestsQuery,
  useApproveJoinRequestMutation,
  useRejectJoinRequestMutation,
  useLeaveTeamMutation,
  useDeleteTeamMutation,
} = teamApi;
