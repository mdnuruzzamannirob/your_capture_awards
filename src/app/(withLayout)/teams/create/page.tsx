'use client';

import Link from 'next/link';
import { useState, type ElementType, type ReactNode } from 'react';
import { ArrowLeft, BadgeCheck, Ban, Crown, ImageIcon, Lock, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { currentUser } from '@/components/module/teams/teamData';
import { InventoryStat, PageHeader, StatusBadge } from '@/components/module/teams/teamUi';

export default function CreateTeamPage() {
  const [submitted, setSubmitted] = useState(false);
  const [teamDraft, setTeamDraft] = useState({
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
      <Button asChild variant="ghost" className="mb-5 px-0 text-zinc-300 hover:bg-transparent">
        <Link href="/teams">
          <ArrowLeft className="size-4" />
          Back to teams
        </Link>
      </Button>

      <PageHeader
        eyebrow={
          <StatusBadge
            icon={canCreateTeam ? BadgeCheck : Ban}
            label={canCreateTeam ? 'Eligible to create' : 'Not eligible'}
            tone={canCreateTeam ? 'green' : 'red'}
          />
        }
        title="Create Team"
        description="Set the team identity, capacity, and public details. The creator becomes Team Leader automatically."
      />

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-md border border-black-2-700 bg-black-2-800/50 p-5 md:p-6">
          {!canCreateTeam ? (
            <LockedState />
          ) : submitted ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <BadgeCheck className="text-primary size-12" />
              <h2 className="mt-5 font-kumbh text-2xl font-bold">Team draft ready</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                Your team is ready to publish.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button asChild>
                  <Link href="/teams">View Teams</Link>
                </Button>
                <Button variant="outline" className="border-black-2-600" onClick={() => setSubmitted(false)}>
                  Edit Draft
                </Button>
              </div>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (canSubmit) setSubmitted(true);
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Team Name">
                  <Input
                    value={teamDraft.name}
                    onChange={(event) => setTeamDraft({ ...teamDraft, name: event.target.value })}
                    placeholder="Aperture Alliance"
                    className="border-black-2-600 bg-black-2-900/40"
                  />
                </FormField>

                <FormField label="Team Identity">
                  <Input
                    value={teamDraft.identity}
                    onChange={(event) =>
                      setTeamDraft({ ...teamDraft, identity: event.target.value })
                    }
                    placeholder="Editorial street photographers"
                    className="border-black-2-600 bg-black-2-900/40"
                  />
                </FormField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Member Capacity">
                  <Select
                    value={teamDraft.capacity}
                    onValueChange={(value) => setTeamDraft({ ...teamDraft, capacity: value })}
                  >
                    <SelectTrigger className="w-full border-black-2-600 bg-black-2-900/40">
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

                <FormField label="Main Focus">
                  <Select
                    value={teamDraft.focus}
                    onValueChange={(value) => setTeamDraft({ ...teamDraft, focus: value })}
                  >
                    <SelectTrigger className="w-full border-black-2-600 bg-black-2-900/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Street">Street</SelectItem>
                      <SelectItem value="Portrait">Portrait</SelectItem>
                      <SelectItem value="Nature">Nature</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  value={teamDraft.description}
                  onChange={(event) =>
                    setTeamDraft({ ...teamDraft, description: event.target.value })
                  }
                  placeholder="Describe the team culture, match style, and what members should expect."
                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 min-h-36 w-full rounded-md border bg-black-2-900/40 px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-[3px]"
                />
              </FormField>

              <div className="rounded-md border border-dashed border-black-2-600 p-5">
                <div className="flex items-start gap-3">
                  <ImageIcon className="text-primary mt-1 size-5" />
                  <div>
                    <h2 className="font-semibold">Team banner</h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      Add a banner image for the team profile.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
                <Crown className="size-4" />
                Create Team
              </Button>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-black-2-700 bg-black-2-800/50 p-5">
            <h2 className="font-kumbh text-xl font-bold">Eligibility</h2>
            <div className="mt-5 space-y-3">
              <RuleRow
                icon={currentUser.registered ? BadgeCheck : Lock}
                label="Registered account"
                passed={currentUser.registered}
              />
              <RuleRow
                icon={currentUser.subscribed ? BadgeCheck : Lock}
                label="Active subscription"
                passed={currentUser.subscribed}
              />
              <RuleRow icon={Crown} label="Creator becomes Team Leader" passed />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-md border border-black-2-700 bg-black-2-800/50 p-2">
            <InventoryStat label="Coins" value={currentUser.coins.toLocaleString()} />
            <InventoryStat label="Keys" value={currentUser.keys} />
            <InventoryStat label="Boosts" value={currentUser.boosts} />
          </div>
        </aside>
      </section>
    </main>
  );
}

function LockedState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center text-center">
      <Lock className="text-primary size-12" />
      <h2 className="mt-5 font-kumbh text-2xl font-bold">Team creation locked</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
        Only subscribed users can create teams. You can still browse teams and send join requests
        after registration.
      </p>
      <Button asChild className="mt-6">
        <Link href="/pricing">View Plans</Link>
      </Button>
    </div>
  );
}

function FormField({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      {children}
    </label>
  );
}

function RuleRow({
  icon: Icon,
  label,
  passed,
}: {
  icon: ElementType;
  label: string;
  passed: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-black-2-700 bg-black-2-900/35 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="text-primary size-4 shrink-0" />
        <span className="truncate text-sm">{label}</span>
      </div>
      <StatusBadge label={passed ? 'OK' : 'Locked'} tone={passed ? 'green' : 'red'} />
    </div>
  );
}
