'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SupportPage() {
  const [submitting, setSubmitting] = useState(false);

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
      const mailto = `mailto:support@yourcaptureawards.com?subject=${encodeURIComponent(subject || 'Support request')}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`,
      )}`;
      window.location.href = mailto;
      toast.success('Opening your email app');
      form.reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="margin container py-10">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-white">Support</h1>
            <p className="mt-2 text-sm text-white/60">
              Send us a message if you have a question, bug report, or account issue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-black-2-600 bg-black-2-800/90 p-5 md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-white/80" htmlFor="name">
                  Name
                </label>
                <Input id="name" name="name" required className="border-black-2-600 bg-black-2-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/80" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="border-black-2-600 bg-black-2-900"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="subject">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                required
                className="border-black-2-600 bg-black-2-900"
                placeholder="What do you need help with?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="message">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                required
                className="min-h-40 border-black-2-600 bg-black-2-900"
                placeholder="Write your message here"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting} className="bg-primary text-black hover:bg-primary/90">
                {submitting ? 'Sending...' : 'Send message'}
              </Button>
            </div>
          </form>
        </div>

        <aside className="space-y-4 rounded-2xl border border-black-2-600 bg-black-2-800/90 p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">Other details</h2>
          <div className="space-y-3 text-sm text-white/65">
            <p>Email: support@yourcaptureawards.com</p>
            <p>Response time: 1 to 2 business days</p>
            <p>For urgent account issues, include your registered email.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
