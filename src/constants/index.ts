import { DiscoverItem } from '@/types';

export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Discover', href: '/discover' },
  { name: 'Challengers', href: '/challengers' },
  { name: 'Contest', href: '/contest' },
  { name: 'Exhibitions', href: '/exhibitions' },
  { name: 'Teams', href: '/teams' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
];

export const discoverItems: DiscoverItem[] = [
  {
    key: 'experiment',
    label: 'Experiment',
    sub: 'WITH YOUR PHOTOS',
    img: '/experiment.png',
  },
  {
    key: 'promote',
    label: 'Promote',
    sub: 'SHARE YOUR CREATIONS',
    img: '/promote.png',
  },
  {
    key: 'charges',
    label: 'Engage',
    sub: 'CONNECT WITH YOUR AUDIENCE',
    img: '/votes.png',
  },
  {
    key: 'keys',
    label: 'Unlock',
    sub: 'DISCOVER NEW POSSIBILITIES',
    img: '/keys.png',
  },
];
