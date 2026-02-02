'use client';

import AwardCard from '@/components/AwardCard';
import { TabsContent } from '@/components/ui/tabs';

const PrizesTab = ({ contest, value }: { contest: any; value: string }) => {
  return (
    <TabsContent value={value} className="mx-auto w-full max-w-4xl space-y-32">
      {contest?.isMoneyContest ? (
        contest?.prizes.map((prize: any, index: any) => (
          <AwardCard
            key={index}
            title={prize?.category === 'TOP_PHOTO' ? 'top-photo' : 'top-photographer'}
            swap={prize?.trades}
            boost={prize?.charges}
            keys={prize?.keys}
          />
        ))
      ) : (
        <p className="flex h-40 items-center justify-center text-center">
          This contest is currently a non-monetary competition. While no cash prizes are awarded,
          top photographers and photos will still receive recognition and accolades for their
          outstanding work. Keep participating and showcase your talent!
        </p>
      )}
    </TabsContent>
  );
};

export default PrizesTab;
