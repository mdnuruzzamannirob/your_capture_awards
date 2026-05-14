'use client';

import { ArrowLeft, BadgeCheck, Crown, ImageIcon, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';

import { currentUser } from '@/components/module/teams/teamData';
import { PageHeader, teamPanelClass, teamShellClass } from '@/components/module/teams/teamUi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
        description="Set your team identity and publish your team workspace. Team creator becomes Team Leader automatically."
      />

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className={`${teamShellClass} p-5 md:p-6`}>
          {!canCreateTeam ? (
            <LockedState />
          ) : submitted ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <BadgeCheck className="text-primary size-12" />
              <h2 className="text-foreground font-kumbh mt-5 text-2xl font-bold">
                Team draft ready
              </h2>
              <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
                Your team profile is ready. You can now open teams and continue in the team
                workspace.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button asChild>
                  <Link href="/teams">Open Teams</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-black-2-600"
                  onClick={() => setSubmitted(false)}
                >
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
                    className="border-black-2-600 bg-black-2-700 text-foreground placeholder:text-muted-foreground"
                  />
                </FormField>

                <FormField label="Team Identity">
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

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Member Capacity">
                  <Select
                    value={teamDraft.capacity}
                    onValueChange={(value) => setTeamDraft({ ...teamDraft, capacity: value })}
                  >
                    <SelectTrigger className="border-border/70 bg-background/60 text-foreground w-full">
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
                    <SelectTrigger className="border-black-2-600 bg-black-2-700 text-foreground w-full">
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
                  className="bg-black-2-700 text-foreground border-black-2-600 placeholder:text-muted-foreground min-h-36 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                />
              </FormField>

              <div className={`${teamPanelClass} border-dashed p-5`}>
                <div className="flex items-start gap-3">
                  <ImageIcon className="text-primary mt-1 size-5" />
                  <div>
                    <h2 className="text-foreground font-semibold">Team banner</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
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
          <div className={`${teamShellClass} p-5`}>
            <h2 className="text-foreground font-kumbh text-xl font-bold">What Happens Next</h2>
            <div className="mt-5 space-y-3">
              <InfoRow
                icon={BadgeCheck}
                label="Create team profile"
                description="Set team name, identity, description, and capacity."
              />
              <InfoRow
                icon={Crown}
                label="Become Team Leader"
                description="Leader can approve requests, manage members, and start team matches."
              />
              <InfoRow
                icon={ImageIcon}
                label="Maintain banner quality"
                description="Use a clean, high-resolution image for consistent visual quality."
              />
            </div>
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
      <h2 className="text-foreground font-kumbh mt-5 text-2xl font-bold">Subscription Required</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
        Only subscribed users can create teams. Upgrade your plan to unlock team creation.
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
      <span className="text-foreground mb-2 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function InfoRow({
  icon: Icon,
  description,
  label,
}: {
  icon: (props: { className?: string }) => ReactNode;
  description: string;
  label: string;
}) {
  return (
    <div className="border-black-2-600 bg-black-2-700 rounded-md border p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="text-primary size-4 shrink-0" />
        <span className="text-foreground truncate text-sm font-medium">{label}</span>
      </div>
      <p className="text-muted-foreground mt-2 text-sm leading-6">{description}</p>
    </div>
  );
}
