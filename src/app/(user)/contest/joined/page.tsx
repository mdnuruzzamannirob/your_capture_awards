import JoinedContest from '@/components/contest/joined/JoinedContest';
import JoinNow from '@/components/contest/joined/JoinNow';
import SwapBoostKeyModal from '@/components/contest/joined/SwapBoostKeyModal';
import { SwapBoostKeyProvider } from '@/providers/SwapBoostKeyProvider';

const JoinedPage = async () => {
  return (
    <main className="margin-user container py-8">
      <SwapBoostKeyProvider>
        <SwapBoostKeyModal />
        <JoinNow />

        <JoinedContest />
      </SwapBoostKeyProvider>
    </main>
  );
};

export default JoinedPage;
