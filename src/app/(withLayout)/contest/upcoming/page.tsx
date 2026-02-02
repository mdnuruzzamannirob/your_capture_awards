import UpcomingContest from '@/components/module/contest/upcoming/UpcomingContest';
import ReduxProvider from '@/providers/ReduxProvider';
import { contestApi } from '@/store/apis/contestApi';
import { makeStore } from '@/store/makeStore';

const UpcomingPage = async () => {
  const store = makeStore();

  await store.dispatch(contestApi.endpoints.getPublicContests.initiate({ status: 'UPCOMING' }));
  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();

  return (
    <main className="margin-user container py-8">
      <ReduxProvider preloadedState={preloadedState}>
        <UpcomingContest />
      </ReduxProvider>
    </main>
  );
};

export default UpcomingPage;
