'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { COUNTRIES, LANGUAGES, SKILL_LEVELS } from '@/constants/team';

const createTeamSchema = z.object({
  name: z.string().min(3, 'Team name should be at least 3 characters').max(50, 'Too long'),
  language: z.string().min(1, 'Select a language'),
  country: z.string().min(1, 'Select a country'),
  description: z.string().min(20, 'Add a stronger description').max(300, 'Max 300 characters'),
  accessibility: z.enum(['PUBLIC', 'PRIVATE']),
  min_requirement: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
});

type CreateTeamValues = z.infer<typeof createTeamSchema>;

const defaultValues: CreateTeamValues = {
  name: '',
  language: 'English',
  country: 'United States',
  description: '',
  accessibility: 'PUBLIC',
  min_requirement: 'BEGINNER',
};

function TeamCreatePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [badgePreview, setBadgePreview] = useState<string | null>(null);
  const [badgeFileName, setBadgeFileName] = useState('No badge selected');

  const form = useForm<CreateTeamValues, any, CreateTeamValues>({
    resolver: zodResolver(createTeamSchema),
    defaultValues,
  });

  const handleBadgeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file for the team badge.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Badge image must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setBadgeFileName(file.name);

    const reader = new FileReader();
    reader.onload = (loadEvent) => setBadgePreview(loadEvent.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearBadge = () => {
    setBadgePreview(null);
    setBadgeFileName('No badge selected');

    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = await form.trigger();
    if (!isValid) return;

    const data = form.getValues();

    toast.success('Team draft ready', {
      description: `${data.name} is ready to be submitted when the create endpoint is connected.`,
    });

    form.reset(defaultValues);
    clearBadge();
  };

  return (
    <main className="margin container py-8 lg:py-10">
      <div className="space-y-5">
        <Link href="/team" className="text-primary hover:text-orange-2-400 text-sm font-medium">
          &lt; View Teams List
        </Link>

        <div className="space-y-2">
          <h1 className="font-kumbh text-foreground text-2xl font-bold sm:text-3xl">
            Build Your Team
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">
            Set up your team name, visibility, language, country, and entry level in a clean dark
            form.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
                  <Upload className="size-4" />
                </span>
                <div>
                  <h2 className="text-foreground font-semibold">Team badge</h2>
                  <p className="text-muted-foreground text-sm">PNG, JPG, or WebP up to 5 MB.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="border-black-2-600 bg-black-2-800 relative size-24 shrink-0 overflow-hidden rounded-2xl border">
                  {badgePreview ? (
                    <Image
                      src={badgePreview}
                      alt="Team badge preview"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(252,102,0,0.2),transparent_70%)]">
                      <Upload className="text-primary size-6" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    aria-label="Team badge upload"
                    title="Team badge upload"
                    className="hidden"
                    onChange={handleBadgeChange}
                  />

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-black-2-600 bg-black-2-700"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload className="size-4" />
                      {badgePreview ? 'Change badge' : 'Upload badge'}
                    </Button>

                    {badgePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={clearBadge}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <p className="text-muted-foreground text-xs">Selected file: {badgeFileName}</p>
                </div>
              </div>
            </div>

            <div className="grid items-start gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
                      Team name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-black-2-600 bg-black-2-700/90"
                        placeholder="Test Team"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_requirement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
                      Level requirement
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="border-black-2-600 bg-black-2-700/90 w-full!">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SKILL_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid items-start gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
                      Language
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="border-black-2-600 bg-black-2-700/90 w-full!">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGES.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
                      Country
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="border-black-2-600 bg-black-2-700/90 w-full!">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accessibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
                    Accessibility
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="border-black-2-600 bg-black-2-700/90 w-full!">
                        <SelectValue placeholder="Choose visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border-black-2-600 bg-black-2-700/90 min-h-32 resize-none"
                      placeholder="A team of skilled players"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 sm:justify-end">
              <Button asChild variant="outline" className="border-black-2-600 bg-black-2-700/80">
                <Link href="/team">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-orange-2-400"
              >
                Create team
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

export default TeamCreatePage;
