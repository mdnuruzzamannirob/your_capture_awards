import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { TeamData } from '@/types/team';
import {
  Languages,
  Lock,
  LogOut,
  MapPin,
  MoreHorizontal,
  Pencil,
  Shield,
  Star,
  Swords,
  Trash2,
  Trophy,
  Unlock,
} from 'lucide-react';
import Image from 'next/image';

interface TeamInfoProps {
  team: TeamData;
  winRate: number;
  isLeader: boolean;
  onEdit: () => void;
  onTogglePrivacy: () => void;
  onLeave: () => void;
  onDisband: () => void;
}

function formatSkillLabel(value: string) {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function TeamInfo({
  team,
  winRate,
  isLeader,
  onEdit,
  onTogglePrivacy,
  onLeave,
  onDisband,
}: TeamInfoProps) {
  const stats = [
    { icon: <Trophy size={11} />, label: 'Points', value: team.score.toLocaleString() },
    {
      icon: <Swords size={11} />,
      label: 'Members',
      value: team.member_count,
    },
    { icon: <Swords size={11} />, label: 'Matches', value: team.total_matches },
    { icon: <Star size={11} />, label: 'Wins', value: team.win },
    { icon: <Shield size={11} />, label: 'Win Rate', value: `${winRate}%` },
  ];

  return (
    <div className="space-y-5 rounded-xl border p-5">
      {/* Header row */}
      <div className="flex items-start gap-4">
        {/* Badge */}
        <div className="bg-black-2-700 flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
          {team.badge ? (
            <Image
              src={team.badge}
              alt="team badge"
              width={72}
              height={72}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground text-lg font-bold">
              {team.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold">{team.name}</h1>
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
            >
              {team.level}
            </Badge>
            <Badge
              variant="outline"
              className={
                team.accessibility === 'PUBLIC'
                  ? 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'text-muted-foreground'
              }
            >
              {team.accessibility === 'PUBLIC' ? 'Public' : 'Private'}
            </Badge>
          </div>

          <p className="text-muted-foreground mb-3 max-w-md text-sm leading-relaxed">
            {team.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="bg-black-2-700 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
              <Languages size={12} /> {team.language}
            </span>
            <span className="bg-black-2-700 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
              <MapPin size={12} /> {team.country}
            </span>
            <span className="bg-black-2-700 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
              Level requirement:{' '}
              {team.min_requirement || team.skill_level
                ? formatSkillLabel(team.min_requirement || team.skill_level)
                : 'N/A'}
            </span>
          </div>
        </div>

        {isLeader && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0">
                <MoreHorizontal size={13} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={onEdit}>
                <Pencil size={13} /> Edit team
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onTogglePrivacy}>
                {team.accessibility === 'PUBLIC' ? (
                  <>
                    <Lock size={13} /> Make private
                  </>
                ) : (
                  <>
                    <Unlock size={13} /> Make public
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onLeave}>
                <LogOut size={13} /> Leave team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={onDisband}>
                <Trash2 size={13} /> Delete team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!isLeader && (
          <Button variant="outline" size="sm" className="shrink-0" onClick={onLeave}>
            <LogOut size={13} className="mr-1.5" /> Leave team
          </Button>
        )}
      </div>

      <Separator />

      {/* Stats */}
      <div>
        <p className="text-muted-foreground mb-3 text-[11px] font-semibold tracking-wider uppercase">
          Team Stats
        </p>
        <div className="flex flex-wrap">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-stretch pr-4">
              {i > 0 && <div className="bg-border mx-4 w-px self-stretch" />}
              <div>
                <div className="text-xl font-bold tabular-nums">{s.value}</div>
                <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[11px]">
                  {s.icon} {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamInfo;
