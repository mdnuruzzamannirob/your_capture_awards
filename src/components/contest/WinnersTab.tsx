'use client';

import { TabsContent } from '../ui/tabs';

const WinnersTab = ({ contest, value }: { contest: any; value: string }) => {
  return (
    <TabsContent value={value} className="">
      WinnersTab
    </TabsContent>
  );
};

export default WinnersTab;
