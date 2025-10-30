import JoinedContest from '@/components/contest/joined/JoinedContest';
import JoinNow from '@/components/contest/joined/JoinNow';
import SwapBoostKeyModal from '@/components/contest/joined/SwapBoostKeyModal';

const JoinedPage = async () => {
  return (
    <main className="margin-user container py-8">
      <SwapBoostKeyModal />
      <JoinNow />

      <JoinedContest />
    </main>
  );
};

export default JoinedPage;
