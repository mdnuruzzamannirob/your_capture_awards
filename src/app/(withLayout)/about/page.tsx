'use client';

import TipTapViewer from '@/components/custom/tiptap-editor/TipTapViewer';
import { Spinner } from '@/components/ui/spinner';
import { useGetSitePolicyQuery } from '@/store/apis/sitePolicyApi';
import { Award, Camera, ShieldCheck, Sparkles, Trophy, UsersRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const highlights = [
  {
    label: 'Curated Contests',
    description: 'Creative challenges designed for photographers to test ideas, craft, and timing.',
    icon: Trophy,
  },
  {
    label: 'Fair Recognition',
    description: 'A transparent contest experience built around voting, milestones, and awards.',
    icon: ShieldCheck,
  },
  {
    label: 'Creative Growth',
    description: 'A place to upload, learn, connect, and build momentum with every submission.',
    icon: Sparkles,
  },
];

const values = [
  { label: 'Integrity', description: 'Contests should feel transparent, consistent, and fair.' },
  { label: 'Respect', description: 'Every participant and creator deserves dignity.' },
  { label: 'Excellence', description: 'Great technical and artistic work should stand out.' },
  {
    label: 'Community',
    description: 'Photography grows through feedback, collaboration, and care.',
  },
];

const stats = [
  { value: 'Open', label: 'for every skill level' },
  { value: 'Global', label: 'photographer community' },
  { value: 'Fair', label: 'voting and award systems' },
];

export default function AboutPage() {
  const { data, isLoading, error } = useGetSitePolicyQuery({ type: 'ABOUT' });
  const policy = data?.data?.[0];
  const updatedDate = policy?.updatedAt
    ? new Date(policy.updatedAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <main className="margin overflow-hidden">
      <section className="border-border relative min-h-[520px] border-b">
        <Image
          src="/images/studio.png"
          alt="Photography studio setup"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_78%,transparent)_48%,color-mix(in_oklab,var(--background)_52%,transparent)_100%)]" />

        <div className="relative container flex min-h-[520px] items-center py-16">
          <div className="max-w-3xl">
            <div className="border-primary/35 bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium">
              <Camera className="size-4" />
              Built for photographers
            </div>
            <h1 className="text-heading max-w-4xl text-4xl leading-tight font-semibold sm:text-5xl lg:text-7xl">
              A modern stage for photography contests and creative recognition.
            </h1>
            <p className="text-body mt-6 max-w-2xl text-base leading-7 sm:text-lg">
              Your Capture Awards brings photographers together through curated contests, fair
              voting, achievement levels, and a community built around craft.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contest/open"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition"
              >
                Explore Contests
              </Link>
              <Link
                href="/support"
                className="border-border-strong text-foreground hover:bg-surface inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 sm:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="border-border bg-surface rounded-lg border p-5">
              <p className="text-primary text-2xl font-semibold">{item.value}</p>
              <p className="text-muted-foreground mt-1 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-border bg-surface-secondary/45 border-y">
        <div className="container grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              Our Mission
            </p>
            <h2 className="text-heading mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
              We help photographers turn remarkable captures into recognized work.
            </h2>
            <p className="text-body mt-5 leading-7">
              The platform exists to make contests easier to join, easier to judge, and more
              rewarding for the photographers who keep showing up with fresh perspective.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map(({ label, description, icon: Icon }) => (
              <article key={label} className="border-border bg-background/70 rounded-lg border p-5">
                <div className="bg-primary/12 text-primary flex size-11 items-center justify-center rounded-md">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-heading mt-5 text-lg font-semibold">{label}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">{description}</p>
              </article>
            ))}
            <article className="border-border bg-background/70 rounded-lg border p-5 sm:col-span-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="bg-primary/12 text-primary flex size-11 shrink-0 items-center justify-center rounded-md">
                  <Award className="size-5" />
                </div>
                <div>
                  <h3 className="text-heading text-lg font-semibold">Awards that feel earned</h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-6">
                    Badges, levels, and prize systems are designed to celebrate consistency,
                    standout images, and meaningful progress.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="container grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div className="border-border relative min-h-[360px] overflow-hidden rounded-lg border sm:min-h-[460px]">
          <Image
            src="/images/photographer.png"
            alt="Photographer preparing a camera"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,var(--background)_0%,transparent_100%)] p-6 pt-20">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
                <UsersRound className="size-5" />
              </div>
              <p className="text-lg font-semibold">Community first, competition second.</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">Core Values</p>
          <h2 className="text-heading mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
            A healthier contest culture starts with clear standards.
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <article key={value.label} className="border-border bg-surface rounded-lg border p-5">
                <h3 className="text-heading font-semibold">{value.label}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-16 sm:pb-24">
        <div className="border-border bg-surface rounded-lg border">
          <div className="border-border border-b p-5 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-primary text-sm font-semibold tracking-wide uppercase">
                  About Your Capture Awards
                </p>
                <h2 className="text-heading mt-2 text-2xl font-semibold sm:text-3xl">
                  Platform Overview
                </h2>
              </div>
              {updatedDate && (
                <p className="text-muted-foreground text-sm">Updated {updatedDate}</p>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            {isLoading ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3">
                <Spinner className="text-primary size-8" />
                <p className="text-muted-foreground text-sm">Loading about information...</p>
              </div>
            ) : error ? (
              <div className="text-destructive flex min-h-48 items-center justify-center text-center">
                Failed to load content. Please try again later.
              </div>
            ) : !policy?.content ? (
              <div className="text-muted-foreground flex min-h-48 items-center justify-center text-center">
                No content available.
              </div>
            ) : (
              <TipTapViewer
                content={policy.content}
                className="text-body [&_a]:text-primary [&_h1]:text-heading [&_h2]:text-heading [&_h3]:text-heading overflow-hidden text-sm leading-7 sm:text-base [&_a]:underline [&_li]:my-1 [&_p]:leading-7 [&_p]:break-words [&_ul]:space-y-1"
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
