import JoinedContestCard from '@/components/contest/joined/JoinedContestCard';
import JoinNow from '@/components/contest/joined/JoinNow';
import SBKModal from '@/components/contest/joined/SBKModal';

const JoinedPage = () => {
  const joinedContestData = [
    {
      id: 1,
    },
    {
      id: 1,
    },
    {
      id: 1,
    },
    {
      id: 1,
    },
    {
      id: 1,
    },
  ];

  return (
    <main className="container mt-[153.5px] py-8">
      <SBKModal />
      <JoinNow />

      <div className="grid grid-cols-2 gap-10">
        {joinedContestData?.map((contest, index) => (
          <JoinedContestCard key={index} contest={contest} />
        ))}
      </div>
    </main>
  );
};

export default JoinedPage;
