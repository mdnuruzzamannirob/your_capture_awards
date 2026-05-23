'use client';

import { ExternalLink, MapPin, Search, Trophy, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import { FreeMode, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DiscoverTeam = {
  id: string;
  name: string;
  country: string;
  members: number;
  score: number;
  description: string;
  banner: string;
  tags: string[];
  visibility: 'Public' | 'Private';
};

const discoverTeams: DiscoverTeam[] = [
  {
    id: 'les-chtis-de-france',
    name: "les ch'tis de France",
    country: 'France',
    members: 15,
    score: 4293744,
    description:
      'Fast contest pacing, strong participation, and a tight rhythm around daily challenges.',
    banner: '/images/TeamPhoto.png',
    tags: ['Street', 'Portrait', 'Daily push'],
    visibility: 'Public',
  },
  {
    id: 'fotomaatjes',
    name: 'FotoMaatjes',
    country: 'Belgium',
    members: 11,
    score: 488440,
    description: 'A welcoming Dutch-speaking team built around clean feedback and shared wins.',
    banner: '/images/photographer.png',
    tags: ['Dutch', 'Casual', 'Teamwork'],
    visibility: 'Private',
  },
  {
    id: 'just-click-capture',
    name: 'Just Click & Capture',
    country: 'United Kingdom',
    members: 12,
    score: 1282856,
    description: 'Active players, clear roles, and steady competition from challenge to challenge.',
    banner: '/images/studio.png',
    tags: ['Active players', 'Rank push', 'Support'],
    visibility: 'Public',
  },
  {
    id: 'bare-skin',
    name: 'bare skin',
    country: 'Denmark',
    members: 15,
    score: 223438,
    description: 'A clean, bold team that likes direct communication and serious weekly contests.',
    banner: '/images/POTY.png',
    tags: ['Editorial', 'Creative', 'Focused'],
    visibility: 'Public',
  },
  {
    id: 'night-frame-club',
    name: 'Night Frame Club',
    country: 'Netherlands',
    members: 19,
    score: 4204025,
    description: 'Low-noise, high-consistency crew for photographers who stay active every day.',
    banner: '/images/person.png',
    tags: ['Night', 'Portrait', 'Voting'],
    visibility: 'Private',
  },
  {
    id: 'color-pulse',
    name: 'Color Pulse',
    country: 'Sweden',
    members: 17,
    score: 3415664,
    description:
      'Bright, lively, and built to climb through contest ranks with a strong voting core.',
    banner: '/images/exhibition.png',
    tags: ['Lifestyle', 'Ranked', 'Social'],
    visibility: 'Public',
  },
  {
    id: 'atomic-view',
    name: 'Atomic View',
    country: 'Germany',
    members: 10,
    score: 2102991,
    description: 'A sharp team for photographers who care about composition and fast response.',
    banner: '/images/key-img.png',
    tags: ['Minimal', 'Sharp', 'Daily'],
    visibility: 'Public',
  },
  {
    id: 'shutter-drift',
    name: 'Shutter Drift',
    country: 'Norway',
    members: 13,
    score: 1640500,
    description: 'Flexible slots, steady participation, and room for members who stay engaged.',
    banner: '/images/boost-img.png',
    tags: ['Flexible', 'Competition', 'Boost'],
    visibility: 'Private',
  },
];

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function Team() {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredTeams = discoverTeams.slice(0, 4);
  const query = searchQuery.trim().toLowerCase();
  const filteredTeams = discoverTeams.filter((team) => {
    const searchable = [team.name, team.country, team.description, team.visibility, ...team.tags]
      .join(' ')
      .toLowerCase();

    return searchable.includes(query);
  });

  return (
    <main className="margin relative isolate container overflow-hidden py-8 lg:py-10">
      <div className="pointer-events-none absolute -top-24 left-8 h-72 w-72 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-32 right-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative space-y-8">
        <section className="space-y-4">
          <div className="text-foreground text-xs font-medium tracking-[0.12em] uppercase">
            Suggested Teams
          </div>

          <div>
            <Swiper
              modules={[FreeMode, Scrollbar]}
              slidesPerView="auto"
              spaceBetween={16}
              freeMode
              scrollbar={{ draggable: true, hide: false }}
              className="team-swiper pb-6"
            >
              {featuredTeams.map((team) => (
                <SwiperSlide key={team.id} className="h-auto! w-71.5! md:w-76.25!">
                  <FeaturedTeamCard team={team} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-foreground text-xs font-medium tracking-[0.12em] uppercase">
              More Teams
            </div>

            <Button asChild variant="outline" className="border-black-2-600 bg-black-2-700/80">
              <Link href="/team/create">
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
              {filteredTeams.length ? (
                filteredTeams.map((team, index) => (
                  <TeamRow key={team.id} team={team} rank={index + 1} />
                ))
              ) : (
                <div className="px-5 py-10 text-center md:px-8">
                  <div className="bg-primary/10 border-primary/20 text-primary mx-auto flex size-12 items-center justify-center rounded-full border">
                    <Search className="size-5" />
                  </div>
                  <h3 className="font-kumbh mt-4 text-2xl font-bold">No teams found</h3>
                  <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
                    Try another keyword or clear the search to see every available team.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeaturedTeamCard({ team }: { team: DiscoverTeam }) {
  return (
    <article className="border-black-2-600 hover:border-orange-2-500/40 h-full overflow-hidden rounded-md border bg-transparent p-3 transition duration-200">
      <div className="border-black-2-600 flex items-start justify-between gap-3 border-b pb-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="border-black-2-600 bg-black-2-800 relative size-11 shrink-0 overflow-hidden rounded-full border">
            <Image src={team.banner} alt={team.name} fill className="object-cover" sizes="44px" />
          </div>

          <div className="min-w-0 pt-0.5">
            <h3 className="truncate text-[15px] leading-5 font-semibold text-balance">
              {team.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-primary inline-flex items-center gap-1 font-semibold">
                <Users className="size-3.5" />
                {team.members}
              </span>
              <span className="text-primary inline-flex items-center gap-1 font-semibold">
                <MapPin className="size-3.5" />
                {team.country.slice(0, 2).toUpperCase()}
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
            {[team.name, team.country, team.tags[0], team.tags[1]].map((value, avatarIndex) => (
              <Avatar
                key={`${team.id}-${avatarIndex}`}
                size="sm"
                className="border-black-2-700 border"
              >
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                  {getInitials(value)}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <span className="text-muted-foreground text-xs font-medium">{team.members}</span>
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
          <Link href={`/team/${team.id}`}>View Team</Link>
        </Button>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-orange-2-400 h-10 flex-1"
        >
          <Link href={`/team/${team.id}`}>Join Team</Link>
        </Button>
      </div>
    </article>
  );
}

function TeamRow({ team, rank }: { team: DiscoverTeam; rank: number }) {
  return (
    <div className="grid gap-4 px-5 py-4 md:grid-cols-[1.8fr_0.7fr_0.7fr_0.8fr_0.7fr_0.7fr] md:items-center md:gap-4">
      <div className="flex items-center gap-3">
        <div className="text-primary bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs font-bold">
          {rank}
        </div>

        <div className="border-black-2-600 bg-black-2-800 relative size-12 shrink-0 overflow-hidden rounded-full border">
          <Image src={team.banner} alt={team.name} fill className="object-cover" sizes="48px" />
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
        {team.members}
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold">
        <Trophy className="text-orange-2-200 size-4" />
        {team.score.toLocaleString()}
      </div>

      <div className="hidden md:flex">
        <span className="border-black-2-600 bg-black-2-800 text-foreground rounded-sm border px-2 py-1 text-xs tracking-[0.24em] uppercase">
          {team.visibility}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          asChild
          variant="ghost"
          className="text-primary hover:text-primary hover:bg-primary/10 px-3"
        >
          <Link href={`/team/${team.id}`}>View</Link>
        </Button>
      </div>
    </div>
  );
}
