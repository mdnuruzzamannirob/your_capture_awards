import JoinedContest from '@/components/contest/joined/JoinedContest';
import SwapBoostKeyModal from '@/components/contest/joined/SwapBoostKeyModal';
import ReduxProvider from '@/providers/ReduxProvider';
import { SwapBoostKeyProvider } from '@/providers/SwapBoostKeyProvider';
import { contestApi } from '@/store/features/contest/contestApi';
import { makeStore } from '@/store/makeStore';

const JoinedPage = async () => {
  const store = makeStore();

  await store.dispatch(contestApi.endpoints.getJoinedContest.initiate());
  await store.dispatch(contestApi.endpoints.getContests.initiate({ status: 'ACTIVE' }));
  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();

  return (
    <main className="margin-user container py-8">
      <ReduxProvider preloadedState={preloadedState}>
        <SwapBoostKeyProvider>
          <SwapBoostKeyModal />

          <JoinedContest />
        </SwapBoostKeyProvider>
      </ReduxProvider>
    </main>
  );
};

export default JoinedPage;
