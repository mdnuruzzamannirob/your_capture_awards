'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitSupportTicketMutation } from '@/store/apis/supportApi';
import {
  Bug,
  Clock,
  CreditCard,
  LifeBuoy,
  Loader2,
  LogIn,
  Mail,
  MessageSquareText,
  Send,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import Image from 'next/image';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

const SUPPORT_EMAIL = 'support@yourcaptureawards.com';

const HELP_TOPICS = [
  {
    label: 'Account & login issues',
    description: 'Sign in, profile access, and verification help.',
    icon: LogIn,
  },
  {
    label: 'Payments & billing',
    description: 'Coins, entry fees, charges, and payment questions.',
    icon: CreditCard,
  },
  {
    label: 'Bugs & technical problems',
    description: 'Broken uploads, voting issues, or unexpected errors.',
    icon: Bug,
  },
  {
    label: 'Team & tournament questions',
    description: 'Team setup, matches, rankings, and contest flow.',
    icon: UsersRound,
  },
];

const supportDetails = [
  {
    label: 'Email',
    value: SUPPORT_EMAIL,
    description: 'Best for account-specific requests.',
    icon: Mail,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    label: 'Response time',
    value: '1 to 2 business days',
    description: 'Most requests are reviewed within one working day.',
    icon: Clock,
  },
  {
    label: 'Verification',
    value: 'Include your registered email',
    description: 'This helps us confirm ownership faster.',
    icon: ShieldCheck,
  },
];

export default function SupportPage() {
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [submitSupportTicket] = useSubmitSupportTicketMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const message = String(formData.get('message') || '');

    try {
      const response = await submitSupportTicket({
        name,
        email,
        subject,
        message,
      }).unwrap();

      toast.success(response.message || 'Support ticket submitted successfully');
      form.reset();
      setSubject('');
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Unable to submit support request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="margin overflow-hidden">
      <section className="border-border relative border-b">
        <Image
          src="/images/banner.png"
          alt="Your Capture Awards support"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_82%,transparent)_56%,color-mix(in_oklab,var(--background)_66%,transparent)_100%)]" />

        <div className="relative container grid min-h-[360px] gap-8 py-14 lg:grid-cols-[1fr_0.75fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="border-primary/35 bg-primary/10 text-primary mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium">
              <LifeBuoy className="size-4" />
              Support Center
            </div>
            <h1 className="text-heading text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
              Get clear help from the Your Capture Awards team.
            </h1>
            <p className="text-body mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              Tell us what happened, include the account details we need, and we will help you get
              back to contests, teams, uploads, and voting.
            </p>
          </div>

          <div className="border-border bg-background/70 rounded-lg border p-5 backdrop-blur">
            <p className="text-muted-foreground text-sm">Before submitting</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="bg-primary mt-1 size-2 shrink-0 rounded-full" />
                Use the email connected to your account.
              </li>
              <li className="flex gap-3">
                <span className="bg-primary mt-1 size-2 shrink-0 rounded-full" />
                Share contest, team, payment, or upload IDs when possible.
              </li>
              <li className="flex gap-3">
                <span className="bg-primary mt-1 size-2 shrink-0 rounded-full" />
                Include screenshots or exact error text in your message.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <form
          onSubmit={handleSubmit}
          className="border-border bg-surface shadow-overlay h-fit rounded-lg border p-5 sm:p-7 lg:p-8"
        >
          <div className="mb-7 flex flex-col gap-2">
            <div className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
              <MessageSquareText className="size-4" />
              Send a request
            </div>
            <h2 className="text-heading text-2xl font-semibold">How can we help?</h2>
            <p className="text-muted-foreground text-sm leading-6">
              Choose a topic or write your own subject, then describe the issue in detail.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Your full name"
                className="border-border bg-background h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="border-border bg-background h-11"
              />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <label className="text-foreground text-sm font-medium" htmlFor="subject">
              Topic
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {HELP_TOPICS.map(({ label, icon: Icon }) => {
                const selected = subject === label;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSubject(label)}
                    className="border-border bg-background hover:border-primary/60 hover:bg-primary/5 data-[selected=true]:border-primary data-[selected=true]:bg-primary/10 flex min-h-12 items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition"
                    data-selected={selected}
                  >
                    <Icon className="text-primary size-4 shrink-0" />
                    <span className="min-w-0">{label}</span>
                  </button>
                );
              })}
            </div>
            <Input
              id="subject"
              name="subject"
              required
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Or type a custom subject"
              className="border-border bg-background h-11"
            />
          </div>

          <div className="mt-5 space-y-2">
            <label className="text-foreground text-sm font-medium" htmlFor="message">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              required
              placeholder="Tell us what happened, what you expected, and any steps we can use to reproduce it."
              className="border-border bg-background min-h-44 resize-none sm:min-h-52"
            />
          </div>

          <div className="mt-6 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-center text-xs leading-5 sm:max-w-sm sm:text-left">
              By submitting, you agree to be contacted at the email above.
            </p>

            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 shrink-0 gap-2 px-5"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Send message
                </>
              )}
            </Button>
          </div>
        </form>

        <aside className="space-y-5">
          <div>
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              Support details
            </p>
            <h2 className="text-heading mt-2 text-2xl font-semibold">What happens next</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              We review requests with account safety in mind, so a little context upfront helps us
              resolve things faster.
            </p>
          </div>

          <div className="grid gap-4">
            {supportDetails.map(({ label, value, description, icon: Icon, href }) => {
              const content = (
                <>
                  <span className="bg-primary/12 text-primary flex size-11 shrink-0 items-center justify-center rounded-md">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="text-heading block font-semibold">{label}</span>
                    <span className="text-foreground mt-1 block text-sm break-words">{value}</span>
                    <span className="text-muted-foreground mt-1 block text-sm leading-5">
                      {description}
                    </span>
                  </span>
                </>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  className="border-border bg-surface hover:border-primary/45 flex gap-4 rounded-lg border p-5 transition"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={label}
                  className="border-border bg-surface flex gap-4 rounded-lg border p-5"
                >
                  {content}
                </div>
              );
            })}
          </div>

          <div className="border-border bg-surface-secondary/45 rounded-lg border p-5">
            <h3 className="text-heading font-semibold">Common requests we handle</h3>
            <div className="mt-4 grid gap-3">
              {HELP_TOPICS.map(({ label, description, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSubject(label)}
                  className="border-border bg-background hover:border-primary/60 hover:bg-primary/5 flex gap-3 rounded-md border p-3 text-left transition"
                >
                  <Icon className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>
                    <span className="text-foreground block text-sm font-medium">{label}</span>
                    <span className="text-muted-foreground mt-1 block text-xs leading-5">
                      {description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
