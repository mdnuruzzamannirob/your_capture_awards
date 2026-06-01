import { baseQuery } from '@/store/baseQuery';
import {
  ApproveRequestResponse,
  AssignRoleResponse,
  CreateTeamResponse,
  DeleteTeamResponse,
  GetActiveTeamMatchResponse,
  GetAvailableTeamContestsResponse,
  GetMyTeamResponse,
  GetPendingRequestsResponse,
  GetSuggestedTeamsResponse,
  GetTeamMembersResponse,
  GetTeamsParams,
  GetTeamsResponse,
  InviteMemberResponse,
  JoinTeamResponse,
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
  tagTypes: [
    'Team',
    'Teams',
    'SuggestedTeams',
    'TeamMembers',
    'JoinRequests',
    'TeamInvitations',
    'TeamMatch',
    'TeamContests',
  ],
  endpoints: (builder) => ({
    // ── Get Teams List ───────────────────────────────────────────────────
    getTeams: builder.query<GetTeamsResponse, GetTeamsParams | void>({
      query: (params) => {
        const { page = 1, limit = 10, search } = params ?? {};

        return {
          url: '/teams',
          method: 'GET',
          params: {
            page,
            limit,
            ...(search ? { search } : {}),
          },
        };
      },
      providesTags: ['Teams'],
    }),

    // ── Get Suggested Teams ─────────────────────────────────────────────
    getSuggestedTeams: builder.query<GetSuggestedTeamsResponse, GetTeamsParams | void>({
      query: (params) => {
        const { page = 1, limit = 10, search } = params ?? {};

        return {
          url: '/teams/suggests',
          method: 'GET',
          params: {
            page,
            limit,
            ...(search ? { search } : {}),
          },
        };
      },
      providesTags: ['SuggestedTeams'],
    }),

    // ── Create Team ──────────────────────────────────────────────────────
    createTeam: builder.mutation<CreateTeamResponse, FormData>({
      query: (data) => ({
        url: '/teams',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Teams', 'SuggestedTeams', 'Team'],
    }),

    // ── Get Team Data ─────────────────────────────────────────────────────
    getMyTeam: builder.query<GetMyTeamResponse, void>({
      query: () => ({
        url: '/teams/my-team',
        method: 'GET',
      }),
      providesTags: ['Team', 'TeamMembers'],
    }),

    // ── Get Single Team ───────────────────────────────────────────────────
    getTeam: builder.query<unknown, string>({
      query: (teamId) => ({
        url: `/teams/${teamId}`,
        method: 'GET',
      }),
      providesTags: (result, error, teamId) => (result ? [{ type: 'Team', id: teamId }] : []),
    }),

    // ── Get Team Members ──────────────────────────────────────────────────
    getTeamMembers: builder.query<GetTeamMembersResponse, string>({
      query: (teamId) => ({
        url: `/teams/members/${teamId}`,
        method: 'GET',
      }),
      providesTags: ['TeamMembers'],
    }),

    // ── Get Active Team Match ───────────────────────────────────────────
    getActiveTeamMatch: builder.query<GetActiveTeamMatchResponse, string>({
      query: (teamId) => ({
        url: `/teams/active-match/${teamId}`,
        method: 'GET',
      }),
      providesTags: (result, error, teamId) =>
        result ? [{ type: 'TeamMatch', id: teamId }] : ['TeamMatch'],
    }),

    // ── Get Team Available Contests ─────────────────────────────────────
    getAvailableTeamContests: builder.query<
      GetAvailableTeamContestsResponse,
      { teamId: string; page?: number; limit?: number }
    >({
      query: ({ teamId, page = 1, limit = 10 }) => ({
        url: `/teams/${teamId}/available-contests`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (result, error, { teamId }) =>
        result ? [{ type: 'TeamContests', id: teamId }] : ['TeamContests'],
    }),

    // ── Join Team ────────────────────────────────────────────────────────
    joinTeam: builder.mutation<JoinTeamResponse, string>({
      query: (teamId) => ({
        url: `/teams/join/${teamId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Team', 'TeamMembers', 'Teams'],
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
    updateTeam: builder.mutation<
      UpdateTeamResponse,
      { teamId: string; data: UpdateTeamRequest | FormData }
    >({
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
    leaveTeam: builder.mutation<LeaveTeamResponse, { teamId: string; memberId?: string }>({
      query: ({ teamId, memberId }) => ({
        url: '/teams/leave',
        method: 'POST',
        body: memberId ? { teamId, memberId } : { teamId },
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
  useGetTeamsQuery,
  useGetSuggestedTeamsQuery,
  useGetTeamQuery,
  useGetActiveTeamMatchQuery,
  useGetAvailableTeamContestsQuery,
  useJoinTeamMutation,
  useCreateTeamMutation,
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
