import CountdownTimer from '@/components/contest/joined/CountdownTimer';
import DynamicDetails from '@/components/contest/joined/DynamicDetails';
import ReduxProvider from '@/providers/ReduxProvider';
import { contestApi } from '@/store/features/contest/contestApi';
import { makeStore } from '@/store/makeStore';
import Image from 'next/image';

const DynamicJoinedPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const store = makeStore();

  const contest =
    ((await store.dispatch(contestApi.endpoints.getContest.initiate({ id })))?.data as any).data ??
    {};
  await Promise.all(store.dispatch(contestApi.util.getRunningQueriesThunk()));
  console.log(contest);
  const preloadedState = store.getState();
  return (
    <main className="margin-user space-y-10">
      <ReduxProvider preloadedState={preloadedState}>
        <div className="bg-black-2-600 relative h-60 w-full overflow-hidden text-gray-300 sm:h-60 md:h-96">
          {contest?.banner ? (
            <Image
              src={contest.banner}
              alt="Banner"
              width={1920}
              height={500}
              className="size-full object-cover opacity-60"
              // onError={() => setCoverError(true)}
            />
          ) : (
            <div className="bg-black-2-600 flex h-full w-full items-center justify-center text-gray-300">
              <p>No banner photo</p>
            </div>
          )}

          <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 space-y-3 text-center">
            <h2 className="inline-block text-4xl font-semibold">{contest?.title}</h2>
            <CountdownTimer startDate={contest?.startDate} endDate={contest?.endDate} />
          </div>
        </div>

        <DynamicDetails id={id} />
      </ReduxProvider>
    </main>
  );
};

export default DynamicJoinedPage;
