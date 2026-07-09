'use client';

import { cn } from '@/utils/cn';
import { useLayoutEffect, useMemo, useState } from 'react';
import { DetailsTab } from './DetailsTab';
import { PrizesTab } from './PrizesTab';
import RankTab from './RankTab';
import { RulesTab } from './RulesTab';
import { WinnerTab } from './WinnerTab';

const New = () => {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState('details');
  const status = 'completed'; // closed  | open | upcoming | joined | completed

  const tabs = useMemo(() => {
    const baseTabs = [
      { href: 'details', label: 'Details' },
      { href: 'prizes', label: 'Prizes' },
      { href: 'rules', label: 'Rules' },
      { href: 'rank', label: 'Rank' },
    ];

    if (status !== 'completed') return baseTabs;

    return [{ href: 'winner', label: 'Winner' }, ...baseTabs];
  }, [status]);

  useLayoutEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="margin-user space-y-10">
      <nav className="bg-surface">
        <div className="container flex h-10 scrollbar-none items-stretch overflow-x-auto lg:justify-center">
          {tabs.map((tab) => {
            const active = selected === tab.href;

            const handleClick = () => {
              setSelected(tab.href);
            };

            return (
              <button
                key={tab.href}
                onClick={handleClick}
                className={cn(
                  'relative flex min-w-max shrink-0 items-center justify-center px-4 text-sm font-medium transition-colors sm:px-5 lg:min-w-fit lg:px-6 lg:text-[15px]',
                  active
                    ? 'bg-primary/12 text-primary shadow-[inset_0_-2px_0_0_color-mix(in_oklab,var(--primary)_90%,transparent)]'
                    : 'text-muted-foreground hover:bg-surface-secondary hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="container">
        {selected === 'winner' && <WinnerTab />}
        {selected === 'details' && <DetailsTab />}
        {selected === 'prizes' && <PrizesTab />}
        {selected === 'rules' && <RulesTab />}
        {selected === 'rank' && <RankTab />}
      </div>
    </div>
  );
};

export default New;
