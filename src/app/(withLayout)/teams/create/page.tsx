'use client';

import { ArrowLeft, BadgeCheck, ImageIcon, Lock, Sparkles, UserMinus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';

import { currentUser } from '@/components/module/teams/teamData';
import {
  AvatarLabel,
  MiniMetric,
  PageHeader,
  StatusBadge,
  teamPanelClass,
  teamShellClass,
  teamTagClass,
} from '@/components/module/teams/teamUi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TeamDraft = {
  name: string;
  identity: string;
  description: string;
  capacity: string;
  focus: string;
};

export default function CreateTeamPage() {
  const [submitted, setSubmitted] = useState(false);
  const [teamDraft, setTeamDraft] = useState<TeamDraft>({
    name: '',
    identity: '',
    description: '',
    capacity: '12',
    focus: 'Street',
  });

  const canCreateTeam = currentUser.registered && currentUser.subscribed;
  const canSubmit =
    canCreateTeam &&
    teamDraft.name.trim() &&
    teamDraft.identity.trim() &&
    teamDraft.description.trim();

  return (
    <main className="margin container py-8 lg:py-10">
      <Button
        asChild
        variant="ghost"
        className="text-muted-foreground hover:text-foreground mb-5 px-0 hover:bg-transparent"
      >
        <Link href="/teams">
          <ArrowLeft className="size-4" />
          Back to teams
        </Link>
      </Button>

      <PageHeader
        title="Create Team"
        description="Set the team name, visual focus, capacity, and contest identity."
      />

      <section className="mt-8">
        <div className={`${teamShellClass} p-5 md:p-6`}>
          {!canCreateTeam ? (
            <LockedState />
          ) : submitted ? (
            <CreatedTeamCard draft={teamDraft} onLeave={() => setSubmitted(false)} />
          ) : (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-kumbh text-2xl font-bold text-foreground">Team Information</h2>
                <p className="text-muted-foreground text-sm">Set your team identity and basic details</p>
              </div>

              <form
                className="space-y-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (canSubmit) setSubmitted(true);
                }}
              >
                <section className={`${teamPanelClass} space-y-4 p-5`}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField label="Team Name" hint="Your team's display name">
                      <Input
                        value={teamDraft.name}
                        onChange={(event) => setTeamDraft({ ...teamDraft, name: event.target.value })}
                        placeholder="Aperture Alliance"
                        className="border-black-2-600 bg-black-2-700 text-foreground placeholder:text-muted-foreground"
                      />
                    </FormField>

                    <FormField label="Team Identity" hint="Short tagline or focus area">
                      <Input
                        value={teamDraft.identity}
                        onChange={(event) =>
                          setTeamDraft({ ...teamDraft, identity: event.target.value })
                        }
                        placeholder="Editorial street photographers"
                        className="border-black-2-600 bg-black-2-700 text-foreground placeholder:text-muted-foreground"
                      />
                    </FormField>
                  </div>

                  <FormField label="Description" hint="Describe your team culture and contest focus">
                    <textarea
                      value={teamDraft.description}
                      onChange={(event) =>
                        setTeamDraft({ ...teamDraft, description: event.target.value })
                      }
                      placeholder="Describe the team culture, match style, and contest focus. What makes your team unique?"
                      className="border-black-2-600 bg-black-2-700 text-foreground placeholder:text-muted-foreground min-h-32 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                    />
                  </FormField>
                </section>

                <section className={`${teamPanelClass} space-y-4 p-5`}>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Team Settings</h3>
                    <p className="text-muted-foreground text-xs">Configure your team size and focus area</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField label="Member Capacity" hint="Maximum team members allowed">
                      <Select
                        value={teamDraft.capacity}
                        onValueChange={(value) => setTeamDraft({ ...teamDraft, capacity: value })}
                      >
                        <SelectTrigger className="border-black-2-600 bg-black-2-700 text-foreground w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">8 members</SelectItem>
                          <SelectItem value="10">10 members</SelectItem>
                          <SelectItem value="12">12 members</SelectItem>
                          <SelectItem value="15">15 members</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Main Focus" hint="Primary photography style">
                      <Select
                        value={teamDraft.focus}
                        onValueChange={(value) => setTeamDraft({ ...teamDraft, focus: value })}
                      >
                        <SelectTrigger className="border-black-2-600 bg-black-2-700 text-foreground w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Street">Street</SelectItem>
                          <SelectItem value="Portrait">Portrait</SelectItem>
                          <SelectItem value="Nature">Nature</SelectItem>
                          <SelectItem value="Studio">Studio</SelectItem>
                          <SelectItem value="Editorial">Editorial</SelectItem>
                          <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                </section>

                <section className={`${teamPanelClass} border-dashed p-5`}>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/15 border-primary/25 text-primary flex size-10 items-center justify-center rounded-md border shrink-0">
                      <ImageIcon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Team Banner</h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        A clean photo banner keeps the team card consistent in browse view. Upload a representative image (1200x600px recommended).
                      </p>
                      <Button variant="outline" className="mt-3 border-black-2-600 bg-black-2-700" disabled>
                        <ImageIcon className="size-4" />
                        Upload Banner
                      </Button>
                    </div>
                  </div>
                </section>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-black-2-600 pt-6">
                  <div className="text-sm text-muted-foreground">
                    You'll be able to edit these details after team creation.
                  </div>
                  <Button type="submit" disabled={!canSubmit} size="lg">
                    <Sparkles className="size-4" />
                    Create Team
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CreatedTeamCard({ draft, onLeave }: { draft: TeamDraft; onLeave: () => void }) {
  const tags = [draft.focus, 'Recruiting', 'New team'];

  return (
    <article className="overflow-hidden rounded-xl border-2 border-black-2-600 bg-black-2-800">
      <div className="relative min-h-80">
        <Image
          src="/images/TeamPhoto.png"
          alt={`${draft.name} team banner`}
          width={1100}
          height={520}
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative grid min-h-80 gap-6 p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col justify-between gap-8">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <StatusBadge icon={BadgeCheck} label="Team created" tone="green" />
              </div>
              <div className="flex items-start gap-3">
                <AvatarLabel name={draft.name || 'New Team'} />
                <div className="min-w-0">
                  <h2 className="font-kumbh text-3xl font-extrabold text-white md:text-4xl">
                    {draft.name}
                  </h2>
                  <p className="text-orange-2-200 mt-2 text-sm font-medium">{draft.identity}</p>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-200">
                {draft.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className={teamTagClass}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-black-2-600 bg-black-2-800/85 rounded-lg border p-4">
            <div className="grid grid-cols-3 gap-2">
              <MiniMetric label="Members" value={`1/${draft.capacity}`} />
              <MiniMetric label="Rank" value="New" />
              <MiniMetric label="Focus" value={draft.focus} />
            </div>

            <div className="border-black-2-600 bg-black-2-700 mt-4 rounded-md border p-3">
              <p className="text-muted-foreground text-xs">Leader</p>
              <p className="mt-1 font-semibold">{currentUser.name}</p>
              <p className="text-muted-foreground mt-3 text-xs">Status</p>
              <p className="mt-1 text-sm text-zinc-200">Ready for members and match setup.</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild>
                <Link href="/teams">Open Teams</Link>
              </Button>
              <Button
                variant="outline"
                className="border-red-normal/40 text-red-light hover:bg-red-normal/15 hover:text-red-light"
                onClick={onLeave}
              >
                <UserMinus className="size-4" />
                Leave
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function LockedState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center text-center">
      <Lock className="text-primary size-12" />
      <h2 className="font-kumbh mt-5 text-2xl font-bold">Subscription Required</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
        Only subscribed users can create teams. Upgrade your plan to unlock team creation.
      </p>
      <Button asChild className="mt-6">
        <Link href="/pricing">View Plans</Link>
      </Button>
    </div>
  );
}

function FormField({ children, label, hint }: { children: ReactNode; label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {hint && <span className="text-muted-foreground mb-2 block text-xs">{hint}</span>}
      {children}
    </label>
  );
}
