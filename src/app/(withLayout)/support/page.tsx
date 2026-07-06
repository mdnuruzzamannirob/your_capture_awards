'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitSupportTicketMutation } from '@/store/apis/supportApi';
import {
  Clock,
  Loader2,
  Mail,
  MessageCircleQuestion,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

const HELP_TOPICS = [
  'Account & login issues',
  'Payments & billing',
  'Bugs & technical problems',
  'Team & tournament questions',
];

export default function SupportPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitSupportTicket] = useSubmitSupportTicketMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const subject = String(formData.get('subject') || '');
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
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Unable to submit support request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="margin container py-10">
      {/* Page header */}
      <div className="text-center sm:text-left">
        <h1 className="text-primary-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Support
        </h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-relaxed sm:mx-0 sm:text-base">
          Have a question, found a bug, or running into an account issue? Send us a message and our
          team will get back to you.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:mt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="border-border-subtle bg-surface-secondary/60 shadow-overlay h-fit space-y-5 rounded-2xl border p-5 backdrop-blur sm:p-6 md:p-7"
        >
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
                className="border-border-subtle bg-surface h-11"
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
                className="border-border-subtle bg-surface h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium" htmlFor="subject">
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              required
              placeholder="What do you need help with?"
              className="border-border-subtle bg-surface h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium" htmlFor="message">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              required
              placeholder="Write your message here"
              className="border-border-subtle bg-surface min-h-36 resize-none sm:min-h-44"
            />
          </div>

          <div className="flex flex-col-reverse items-center gap-3 pt-1 sm:flex-row sm:justify-between">
            <p className="text-muted-foreground text-center text-xs sm:text-left">
              By submitting, you agree to be contacted at the email above.
            </p>

            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 w-full shrink-0 gap-2 sm:w-auto sm:min-w-40"
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

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="border-border-subtle bg-surface-secondary/60 space-y-4 rounded-2xl border p-5 backdrop-blur sm:p-6">
            <h2 className="text-primary-foreground text-lg font-semibold">Other details</h2>

            <div className="space-y-3">
              <a
                href="mailto:support@yourcaptureawards.com"
                className="group border-border-subtle bg-surface hover:border-primary/40 flex items-center gap-3 rounded-xl border p-3 transition"
              >
                <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-primary-foreground text-sm font-medium">Email us</p>
                  <p className="text-muted-foreground group-hover:text-primary truncate text-xs transition">
                    support@yourcaptureawards.com
                  </p>
                </div>
              </a>

              <div className="border-border-subtle bg-surface flex items-center gap-3 rounded-xl border p-3">
                <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Clock className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-primary-foreground text-sm font-medium">Response time</p>
                  <p className="text-muted-foreground text-xs">1 to 2 business days</p>
                </div>
              </div>

              <div className="border-border-subtle bg-surface flex items-center gap-3 rounded-xl border p-3">
                <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <ShieldCheck className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-primary-foreground text-sm font-medium">Account issues?</p>
                  <p className="text-muted-foreground text-xs">
                    Always include your registered email for faster verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-border-subtle bg-surface-secondary/60 space-y-3 rounded-2xl border p-5 backdrop-blur sm:p-6">
            <h2 className="text-primary-foreground flex items-center gap-2 text-base font-semibold">
              Common topics
            </h2>
            <ul className="space-y-2">
              {HELP_TOPICS.map((topic) => (
                <li
                  key={topic}
                  className="border-border-subtle bg-surface text-muted-foreground rounded-lg border px-3 py-2 text-sm"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
