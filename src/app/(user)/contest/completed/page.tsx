import CompletedContest from '@/components/contest/completed/CompletedContest';
import ReduxProvider from '@/providers/ReduxProvider';
import { contestApi } from '@/store/features/contest/contestApi';
import { makeStore } from '@/store/makeStore';

const CompletedPage = async () => {
  const store = makeStore();

  await store.dispatch(contestApi.endpoints.getContests.initiate({ status: 'COMPLETED' }));
  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();

  return (
    <main className="margin-user container py-8">
      <ReduxProvider preloadedState={preloadedState}>
        <CompletedContest />
      </ReduxProvider>
    </main>
  );
};

export default CompletedPage;
