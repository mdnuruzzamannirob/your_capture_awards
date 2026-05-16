import ContestDetails from '@/components/module/contest/ContestDetails';
import ReduxProvider from '@/providers/ReduxProvider';
import { contestApi } from '@/store/apis/contestApi';
import { makeStore } from '@/store/makeStore';
import { Suspense } from 'react';

const DynamicJoinedPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const store = makeStore();

  await store.dispatch(contestApi.endpoints.getContest.initiate({ id }));

  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();
  return (
    <ReduxProvider preloadedState={preloadedState}>
      <Suspense fallback={<div>Loading...</div>}>
        <ContestDetails id={id} />
      </Suspense>
    </ReduxProvider>
  );
};

export default DynamicJoinedPage;
