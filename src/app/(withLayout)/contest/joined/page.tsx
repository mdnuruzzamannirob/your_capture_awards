import JoinedContest from '@/components/module/contest/joined/JoinedContest';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const JoinedPage = () => {
  return (
    <main className="margin-user container py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <JoinedContest />
      </Suspense>
    </main>
  );
};

export default JoinedPage;
