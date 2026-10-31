import { Status } from '@/store/types/contestTypes';

const TAB_ORDER = ['winners', 'details', 'prizes', 'rules', 'rank'] as const;

const sortTabs = (tabs: { key: string; label: string }[]) => {
  return tabs.sort((a, b) => TAB_ORDER.indexOf(a.key as any) - TAB_ORDER.indexOf(b.key as any));
};

const getContestTabs = (status: Status, isPhotographyOfYear = false) => {
  let tabs = [
    { label: 'Details', key: 'details' },
    { label: 'Prizes', key: 'prizes' },
    { label: 'Rank', key: 'rank' },
  ];

  if (status === 'CLOSED' || status === 'COMPLETED') {
    tabs = [...tabs, { label: 'Winners', key: 'winners' }, { label: 'Rules', key: 'rules' }];
  }

  if (status === 'ACTIVE') {
    tabs = [...tabs, { label: 'Rules', key: 'rules' }];
  }

  if (status === 'UPCOMING') {
    tabs = [...tabs, { label: 'Rules', key: 'rules' }].filter((item) => item.key !== 'rank');
  }

  // POTY has no prizes or award winners - its standing lives in the Rank tab.
  if (isPhotographyOfYear) {
    tabs = tabs.filter((item) => item.key !== 'prizes' && item.key !== 'winners');
  }

  return sortTabs(tabs);
};

export default getContestTabs;
