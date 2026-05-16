import JoinedContest from '@/components/module/contest/joined/JoinedContest';
import SwapBoostKeyModal from '@/components/module/contest/joined/SwapBoostKeyModal';
import ReduxProvider from '@/providers/ReduxProvider';
import { SwapBoostKeyProvider } from '@/providers/SwapBoostKeyProvider';
import { contestApi } from '@/store/apis/contestApi';
import { makeStore } from '@/store/makeStore';
import { Suspense } from 'react';

const JoinedPage = async () => {
  const store = makeStore();

  await store.dispatch(contestApi.endpoints.getJoinedContest.initiate({ page: 1, limit: 10 }));
  await store.dispatch(contestApi.endpoints.getPrivateContests.initiate({ status: 'ACTIVE' }));
  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();

  return (
    <main className="margin-user container py-8">
      <ReduxProvider preloadedState={preloadedState}>
        <SwapBoostKeyProvider>
          <SwapBoostKeyModal />

          <Suspense fallback={<div>Loading...</div>}>
            <JoinedContest />
          </Suspense>
        </SwapBoostKeyProvider>
      </ReduxProvider>
    </main>
  );
};

export default JoinedPage;
