'use client';

import TeamsHomeGuard from '@/components/module/team/TeamsHomeGuard';

export default function TeamHomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TeamsHomeGuard>{children}</TeamsHomeGuard>;
}
