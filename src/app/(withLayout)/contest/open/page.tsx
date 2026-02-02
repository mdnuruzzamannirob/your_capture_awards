import OpenContest from '@/components/module/contest/open/OpenContest';
import ReduxProvider from '@/providers/ReduxProvider';
import { contestApi } from '@/store/apis/contestApi';
import { makeStore } from '@/store/makeStore';
import { decodeToken } from '@/utils/decodeToken';
import { cookies } from 'next/headers';

const OpenPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value ?? null;
  const decoded = decodeToken(token);
  const isAuthenticated = !!decoded;

  const store = makeStore();

  // Use private API if authenticated, public API otherwise
  if (isAuthenticated) {
    await store.dispatch(
      contestApi.endpoints.getPrivateContests.initiate({
        status: 'ACTIVE',
      }),
    );
  } else {
    await store.dispatch(
      contestApi.endpoints.getPublicContests.initiate({
        status: 'ACTIVE',
      }),
    );
  }
  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();

  return (
    <main className="margin-user container py-8">
      <ReduxProvider preloadedState={preloadedState}>
        <OpenContest isAuthenticated={isAuthenticated} />
      </ReduxProvider>
    </main>
  );
};

export default OpenPage;
