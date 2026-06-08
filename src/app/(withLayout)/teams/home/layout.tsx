'use client';

import TeamsHeader from '@/components/layout/TeamsHeader';

export default function TeamHomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TeamsHeader />
      {children}
    </>
  );
}
