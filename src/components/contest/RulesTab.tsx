'use client';

import { cn } from '@/utils/cn';
import { TabsContent } from '../ui/tabs';

const RulesTab = ({ contest, value }: { contest: any; value: string }) => {
  return (
    <TabsContent value={value} className="">
      {contest?.rules?.map((rule: any, index: any) => (
        <div
          className={cn('border-primary space-y-5 border-t py-8', index === 0 && 'border-t-0 pt-0')}
          key={index}
        >
          <h3 className="text-xl font-semibold">{rule?.name}</h3>
          <p>{rule?.description}</p>
        </div>
      ))}
    </TabsContent>
  );
};

export default RulesTab;
