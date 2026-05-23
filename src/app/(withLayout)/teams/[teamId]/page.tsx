import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { teamCardClass, teamShellClass } from '@/components/module/teams/teamUi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTeamDetailById } from '@/lib/mock/teamDetails';
import { getAvatarClass, getInitials, getMemberName } from '@/utils/team-utils';
import { BadgeCheck, Languages, MapPin, Medal, Trophy, Users } from 'lucide-react';

function formatSkillLabel(value: string) {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function getRoleBadgeClass(level: string) {
  switch (level) {
    case 'LEADER':
      return 'border-orange-2-500/40 bg-orange-2-500/15 text-orange-2-100';
    case 'MODERATOR':
      return 'border-sky-500/40 bg-sky-500/15 text-sky-100';
    default:
      return 'border-black-2-500 bg-black-2-700 text-muted-foreground';
  }
}

export default async function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;

  if (!teamId) {
    notFound();
  }

  const team = getTeamDetailById(teamId);

  if (!team) {
    notFound();
  }

  const metrics = [
    { icon: Trophy, label: 'Team Score', value: team.score.toLocaleString() },
    { icon: Medal, label: 'Team Wins', value: team.win.toLocaleString() },
    {
      icon: BadgeCheck,
      label: 'Win Rate',
      value: `${Math.round((team.win / team.total_matches) * 100)}%`,
    },
    { icon: Users, label: 'Team Members', value: `${team.member_count}/${team.member_slots}` },
    { icon: Languages, label: 'Language', value: team.language },
    { icon: MapPin, label: 'Country', value: team.country },
  ];

  const members = team.members.map((member, index) => ({
    ...member,
    points: team.score - index * 123456,
  }));

  return (
    <main className="margin container py-8 lg:py-10">
      <div className="space-y-5">
        <Link href="/teams" className="text-primary hover:text-orange-2-400 text-sm font-medium">
          &lt; View Teams List
        </Link>

        <div className="space-y-2">
          <h1 className="font-kumbh text-foreground text-2xl font-bold sm:text-3xl">TEAM INFO</h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">
            Team details, member activity, and match strength in the same dark system used across
            the app.
          </p>
        </div>

        <section className={`${teamShellClass} overflow-hidden`}>
          <div className="border-black-2-600 border-b p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
                <div className="border-black-2-600 bg-black-2-700 relative size-28 shrink-0 overflow-hidden rounded-full border-4 sm:size-32 lg:size-36">
                  {team.badge ? (
                    <Image
                      src={team.badge}
                      alt={team.name}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  ) : (
                    <div className="bg-primary text-primary-foreground flex size-full items-center justify-center text-2xl font-bold">
                      {team.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-3 pt-1 sm:pt-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-kumbh text-foreground text-2xl font-bold sm:text-[28px]">
                      {team.name}
                    </h2>
                    <Badge
                      variant="outline"
                      className="border-orange-2-500/40 bg-orange-2-500/10 text-orange-2-100"
                    >
                      {team.level}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        team.accessibility === 'PUBLIC'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                          : 'border-black-2-600 bg-black-2-700 text-muted-foreground'
                      }
                    >
                      {team.accessibility === 'PUBLIC' ? 'Public' : 'Private'}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground max-w-4xl text-sm leading-7 sm:text-[15px]">
                    {team.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="border-black-2-600 bg-black-2-700 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                      <Languages size={12} /> {team.language}
                    </span>
                    <span className="border-black-2-600 bg-black-2-700 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                      <MapPin size={12} /> {team.country}
                    </span>
                    <span className="border-black-2-600 bg-black-2-700 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                      Level Requirement:{' '}
                      {formatSkillLabel(team.min_requirement || team.skill_level)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 justify-end">
                <Button className="bg-primary text-primary-foreground hover:bg-orange-2-400 h-12 rounded-md px-8 font-semibold">
                  Join Team
                </Button>
              </div>
            </div>

            <div className={`${teamCardClass} relative mt-8 px-4 py-4 sm:px-5`}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {metrics.map((metric) => {
                  const Icon = metric.icon;

                  return (
                    <div key={metric.label} className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-foreground text-lg leading-none font-bold">
                          {metric.value}
                        </div>
                        <div className="text-muted-foreground mt-1 text-[11px] font-medium">
                          {metric.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Separator className="bg-black-2-600" />

          <div className="divide-black-2-600 divide-y">
            {members.map((member, index) => {
              const name = getMemberName(member.member);

              return (
                <div
                  key={member.id}
                  className="hover:bg-black-2-700/40 grid grid-cols-1 items-center gap-4 px-5 py-4 transition-colors sm:grid-cols-[56px_minmax(0,1fr)_240px] sm:px-6 lg:grid-cols-[64px_minmax(0,1fr)_280px]"
                >
                  <div className="text-muted-foreground text-center text-lg font-medium">
                    {index + 1}
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-12 shrink-0">
                      {member.member.avatar && <AvatarImage src={member.member.avatar} />}
                      <AvatarFallback
                        className={`text-sm font-semibold ${getAvatarClass(member.level)}`}
                      >
                        {getInitials(
                          member.member.fullName,
                          member.member.firstName ?? undefined,
                          member.member.lastName ?? undefined,
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate font-semibold max-sm:text-sm">{name}</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        {member.member.location ?? 'Unknown location'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <span
                      className={`inline-flex rounded-sm border px-2 py-1 text-xs font-semibold tracking-[0.24em] uppercase ${getRoleBadgeClass(member.level)}`}
                    >
                      {member.level.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
