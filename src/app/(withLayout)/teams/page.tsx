'use client';

import { ExternalLink, MapPin, Search, Trophy, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import { FreeMode, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetSuggestedTeamsQuery, useGetTeamsQuery } from '@/store/apis/teamApi';
import type { PaginationMeta, TeamListItem, TeamUserSummary } from '@/store/types/teamTypes';

const PAGE_SIZE = 8;
const FEATURED_LIMIT = 8;
const TEAM_BANNER_PLACEHOLDER = '/images/TeamPhoto.png';

const EMPTY_META: PaginationMeta = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

function getUserName(user?: TeamUserSummary) {
  if (!user) return 'Team member';

  return (
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.username ||
    'Team member'
  );
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function getTeamBanner(team: TeamListItem) {
  return team.badge || TEAM_BANNER_PLACEHOLDER;
}

function getTeamAvatars(team: TeamListItem) {
  const members = team.members?.map((member) => member.member).filter(Boolean) ?? [];

  if (members.length > 0) {
    return members.slice(0, 4);
  }

  return team.creator ? [team.creator] : [];
}

function TeamCardSkeleton() {
  return (
    <article className="border-black-2-600 h-full overflow-hidden rounded-md border bg-transparent p-3">
      <div className="border-black-2-600 flex items-start justify-between gap-3 border-b pb-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="bg-black-2-700 relative size-11 shrink-0 overflow-hidden rounded-full" />
          <div className="min-w-0 space-y-2 pt-0.5">
            <div className="bg-black-2-700 h-4 w-32 rounded" />
            <div className="bg-black-2-700 h-3 w-24 rounded" />
          </div>
        </div>
        <div className="bg-black-2-700 size-4 rounded-full" />
      </div>

      <div className="relative px-1 py-3">
        <div className="flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            <div className="border-black-2-700 bg-black-2-700 size-6 rounded-full border" />
            <div className="border-black-2-700 bg-black-2-700 size-6 rounded-full border" />
            <div className="border-black-2-700 bg-black-2-700 size-6 rounded-full border" />
            <div className="border-black-2-700 bg-black-2-700 size-6 rounded-full border" />
          </div>
          <div className="bg-black-2-700 h-3 w-8 rounded" />
        </div>
      </div>

      <div className="border-black-2-600 min-h-22 border-t pt-3">
        <div className="bg-black-2-700 h-3 w-full rounded" />
        <div className="bg-black-2-700 mt-2 h-3 w-5/6 rounded" />
        <div className="bg-black-2-700 mt-2 h-3 w-2/3 rounded" />
      </div>

      <div className="mt-3 flex gap-2">
        <div className="border-black-2-600 bg-black-2-800/70 h-10 flex-1 rounded-md border" />
        <div className="bg-black-2-700 h-10 flex-1 rounded-md" />
      </div>
    </article>
  );
}

function TeamRowSkeleton() {
  return (
    <div className="grid gap-4 px-5 py-4 md:grid-cols-[1.8fr_0.7fr_0.7fr_0.8fr_0.7fr_0.7fr] md:items-center md:gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-black-2-700 flex size-8 shrink-0 items-center justify-center rounded-full" />
        <div className="bg-black-2-700 relative size-12 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="bg-black-2-700 h-4 w-36 rounded" />
          <div className="bg-black-2-700 hidden h-3 w-52 rounded md:block" />
        </div>
      </div>

      <div className="hidden md:block">
        <div className="bg-black-2-700 h-7 w-24 rounded-sm" />
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold">
        <div className="bg-black-2-700 size-4 rounded-full" />
        <div className="bg-black-2-700 h-4 w-10 rounded" />
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold">
        <div className="bg-black-2-700 size-4 rounded-full" />
        <div className="bg-black-2-700 h-4 w-12 rounded" />
      </div>

      <div className="hidden md:flex">
        <div className="bg-black-2-700 h-7 w-20 rounded-sm" />
      </div>

      <div className="flex items-center justify-end gap-2">
        <div className="bg-black-2-700 h-8 w-14 rounded-md" />
      </div>
    </div>
  );
}

function FeaturedTeamCard({ team }: { team: TeamListItem }) {
  const avatars = getTeamAvatars(team);

  return (
    <article className="border-black-2-600 hover:border-orange-2-500/40 h-full overflow-hidden rounded-md border bg-transparent p-3 transition duration-200">
      <div className="border-black-2-600 flex items-start justify-between gap-3 border-b pb-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="border-black-2-600 bg-black-2-800 relative size-11 shrink-0 overflow-hidden rounded-full border">
            <Image
              src={getTeamBanner(team)}
              alt={team.name}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>

          <div className="min-w-0 pt-0.5">
            <h3 className="truncate text-[15px] leading-5 font-semibold text-balance">
              {team.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-primary inline-flex items-center gap-1 font-semibold">
                <Users className="size-3.5" />
                {team.member_count}
              </span>
              <span className="text-primary inline-flex items-center gap-1 font-semibold">
                <MapPin className="size-3.5" />
                {team.country}
              </span>
              <span className="text-muted-foreground inline-flex items-center gap-1 font-medium">
                <Trophy className="text-orange-2-200 size-3.5" />
                {team.score.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="text-muted-foreground hover:text-foreground rounded-full p-1 transition"
          aria-label={`Close ${team.name}`}
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="relative px-1 py-3">
        <div className="flex items-center justify-center gap-2">
          <AvatarGroup className="justify-center">
            {avatars.map((user, avatarIndex) => (
              <Avatar
                key={`${team.id}-${avatarIndex}`}
                size="sm"
                className="border-black-2-700 border"
              >
                {user.avatar ? <AvatarImage src={user.avatar} alt={getUserName(user)} /> : null}
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                  {getInitials(getUserName(user))}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <span className="text-muted-foreground text-xs font-medium">
            {avatars.length ? `${avatars.length}` : team.member_count}
          </span>
        </div>
      </div>

      <p className="text-muted-foreground border-black-2-600 min-h-22 border-t pt-3 text-sm leading-6">
        {team.description}
      </p>

      <div className="mt-3 flex gap-2">
        <Button
          asChild
          variant="outline"
          className="border-black-2-600 bg-black-2-800/70 text-primary h-10 flex-1"
        >
          <Link href={`/teams/${team.id}`}>View Team</Link>
        </Button>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-orange-2-400 h-10 flex-1"
        >
          <Link href={`/teams/${team.id}`}>Join Team</Link>
        </Button>
      </div>
    </article>
  );
}

function TeamRow({ team, rank }: { team: TeamListItem; rank: number }) {
  return (
    <div className="grid gap-4 px-5 py-4 md:grid-cols-[1.8fr_0.7fr_0.7fr_0.8fr_0.7fr_0.7fr] md:items-center md:gap-4">
      <div className="flex items-center gap-3">
        <div className="text-primary bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs font-bold">
          {rank}
        </div>
        <div className="border-black-2-600 bg-black-2-800 relative size-12 shrink-0 overflow-hidden rounded-full border">
          <Image
            src={getTeamBanner(team)}
            alt={team.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-balance">{team.name}</h3>
          <p className="text-muted-foreground mt-1 text-xs md:hidden">{team.country}</p>
          <p className="text-muted-foreground mt-1 hidden text-xs md:block">{team.description}</p>
        </div>
      </div>

      <div className="hidden md:block">
        <span className="border-black-2-600 bg-black-2-800 text-muted-foreground rounded-sm border px-2 py-1 text-xs">
          {team.country}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold">
        <Users className="text-muted-foreground size-4" />
        {team.member_count}
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold">
        <Trophy className="text-orange-2-200 size-4" />
        {team.score.toLocaleString()}
      </div>

      <div className="hidden md:flex">
        <span className="border-black-2-600 bg-black-2-800 text-foreground rounded-sm border px-2 py-1 text-xs tracking-[0.24em] uppercase">
          {team.accessibility}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          asChild
          variant="ghost"
          className="text-primary hover:text-primary hover:bg-primary/10 px-3"
        >
          <Link href={`/teams/${team.id}`}>View</Link>
        </Button>
      </div>
    </div>
  );
}

export default function Team() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchQuery.trim());

  useEffect(() => {
    setPage(1);
  }, [deferredSearch]);

  const teamsQuery = useGetTeamsQuery({
    page,
    limit: PAGE_SIZE,
    search: deferredSearch || undefined,
  });

  const suggestedQuery = useGetSuggestedTeamsQuery({
    page: 1,
    limit: FEATURED_LIMIT,
  });

  const teams = teamsQuery.data?.data ?? [];
  const suggestedTeams = suggestedQuery.data?.data ?? [];
  const meta = teamsQuery.data?.meta ?? EMPTY_META;
  const featuredTeams = suggestedTeams.slice(0, 4);

  const isSearching = deferredSearch.length > 0;
  const hasResults = teams.length > 0;

  const summary = useMemo(() => {
    if (!meta.total) return 'No teams loaded yet.';

    return `${meta.total.toLocaleString()} teams available`;
  }, [meta.total]);

  return (
    <main className="margin relative isolate container overflow-hidden py-8 lg:py-10">
      <div className="pointer-events-none absolute -top-24 left-8 h-72 w-72 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-32 right-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative space-y-8">
        <section className="space-y-4">
          <div className="text-foreground text-xs font-medium tracking-[0.12em] uppercase">
            Suggested Teams
          </div>

          <Swiper
            modules={[FreeMode, Scrollbar]}
            slidesPerView="auto"
            spaceBetween={16}
            freeMode
            scrollbar={{ draggable: true, hide: false }}
            className="team-swiper pb-6"
          >
            {suggestedQuery.isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <SwiperSlide key={index} className="h-auto! w-71.5! md:w-76.25!">
                  <TeamCardSkeleton />
                </SwiperSlide>
              ))
            ) : featuredTeams.length ? (
              featuredTeams.map((team) => (
                <SwiperSlide key={team.id} className="h-auto! w-71.5! md:w-76.25!">
                  <FeaturedTeamCard team={team} />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="w-full!">
                <div className="border-black-2-600 rounded-md border bg-transparent p-4 text-center">
                  <p className="text-foreground font-semibold">No suggested teams yet</p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    The suggestion endpoint returned an empty list.
                  </p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-foreground text-xs font-medium tracking-[0.12em] uppercase">
              More Teams
            </div>

            <Button asChild variant="outline" className="border-black-2-600 bg-black-2-700/80">
              <Link href="/teams/create">
                Create Team
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="relative w-full">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by team's name"
              className="border-black-2-600 bg-black-2-700/90 text-foreground placeholder:text-muted-foreground pr-11"
            />
          </div>

          <div className="border-black-2-600 mt-6 overflow-hidden rounded-xl border">
            <div className="text-muted-foreground border-black-2-600 hidden grid-cols-[1.8fr_0.7fr_0.7fr_0.8fr_0.7fr_0.7fr] gap-4 border-b px-5 py-4 text-xs font-semibold tracking-[0.24em] uppercase md:grid">
              <div>Team Name</div>
              <div>Country</div>
              <div>Members</div>
              <div>Team Score</div>
              <div>Visibility</div>
              <div className="text-right">Action</div>
            </div>

            <div className="divide-black-2-600 divide-y">
              {teamsQuery.isLoading ? (
                Array.from({ length: 6 }).map((_, index) => <TeamRowSkeleton key={index} />)
              ) : teamsQuery.isError ? (
                <div className="px-5 py-10 text-center md:px-8">
                  <div className="bg-primary/10 border-primary/20 text-primary mx-auto flex size-12 items-center justify-center rounded-full border">
                    <Search className="size-5" />
                  </div>
                  <h3 className="font-kumbh mt-4 text-2xl font-bold">Unable to load teams</h3>
                  <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
                    Refresh the page or try again in a moment.
                  </p>
                </div>
              ) : hasResults ? (
                teams.map((team, index) => (
                  <TeamRow
                    key={team.id}
                    team={team}
                    rank={(meta.page - 1) * meta.limit + index + 1}
                  />
                ))
              ) : (
                <div className="px-5 py-10 text-center md:px-8">
                  <div className="bg-primary/10 border-primary/20 text-primary mx-auto flex size-12 items-center justify-center rounded-full border">
                    <Search className="size-5" />
                  </div>
                  <h3 className="font-kumbh mt-4 text-2xl font-bold">
                    {isSearching ? 'No matching teams found' : 'No teams found'}
                  </h3>
                  <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
                    {isSearching
                      ? 'Try another keyword or clear the search to see every available team.'
                      : 'The teams list endpoint returned no data.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-black-2-600 bg-black-2-800/60 flex flex-col gap-4 rounded-xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              Page {meta.page} of {meta.totalPage} · {teams.length.toLocaleString()} shown
              {meta.total ? ` · ${meta.total.toLocaleString()} total` : ''}
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-black-2-600 bg-black-2-700/80"
                disabled={!meta.hasPreviousPage || teamsQuery.isFetching}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              >
                Previous
              </Button>

              <Button
                type="button"
                variant="outline"
                className="border-black-2-600 bg-black-2-700/80"
                disabled={!meta.hasNextPage || teamsQuery.isFetching}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
