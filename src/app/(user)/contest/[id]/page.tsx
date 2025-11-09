import ContestDetails from '@/components/contest/ContestDetails';
import ReduxProvider from '@/providers/ReduxProvider';
import { contestApi } from '@/store/features/contest/contestApi';
import { makeStore } from '@/store/makeStore';

const DynamicJoinedPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const store = makeStore();

  await store.dispatch(contestApi.endpoints.getContest.initiate({ id }));

  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();
  return (
    <ReduxProvider preloadedState={preloadedState}>
      <ContestDetails id={id} />
    </ReduxProvider>
  );
};

export default DynamicJoinedPage;
