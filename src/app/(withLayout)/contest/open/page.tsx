import OpenContest from '@/components/module/contest/open/OpenContest';
import ReduxProvider from '@/providers/ReduxProvider';
import { contestApi } from '@/store/apis/contestApi';
import { makeStore } from '@/store/makeStore';

const OpenPage = async () => {
  const store = makeStore();

  await store.dispatch(contestApi.endpoints.getPublicContests.initiate({ status: 'ACTIVE' }));
  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();

  return (
    <main className="margin-user container py-8">
      <ReduxProvider preloadedState={preloadedState}>
        <OpenContest />
      </ReduxProvider>
    </main>
  );
};

export default OpenPage;
