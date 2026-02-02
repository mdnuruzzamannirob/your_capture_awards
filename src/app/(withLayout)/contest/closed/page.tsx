import ClosedContest from '@/components/module/contest/closed/ClosedContest';
import ReduxProvider from '@/providers/ReduxProvider';
import { contestApi } from '@/store/apis/contestApi';
import { makeStore } from '@/store/makeStore';

const ClosedPage = async () => {
  const store = makeStore();

  await store.dispatch(contestApi.endpoints.getPublicContests.initiate({ status: 'CLOSED' }));
  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();

  return (
    <main className="margin-user container py-8">
      <ReduxProvider preloadedState={preloadedState}>
        <ClosedContest />
      </ReduxProvider>
    </main>
  );
};

export default ClosedPage;
