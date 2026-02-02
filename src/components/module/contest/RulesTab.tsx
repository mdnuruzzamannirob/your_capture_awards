'use client';

import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/utils/cn';

const RulesTab = ({ contest, value }: { contest: any; value: string }) => {
  return (
    <TabsContent value={value} className="mx-auto w-full max-w-4xl">
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
