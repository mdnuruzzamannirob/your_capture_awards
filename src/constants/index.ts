import { DiscoverItem, FeatureItem, NavLink } from '@/types';

export const navLinks: NavLink[] = [
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

export const FeatureItems: FeatureItem[] = [
  {
    title: 'Photographer of the year',
    description:
      'Capturing moments that transcend time, Photographer of the Year unveils the world"s beauty through a lens of innovation and emotion.',
    img: '/POTY.png',
    href: '/photographer-of-the-year',
  },
  {
    title: 'Create a Team',
    description:
      'A dynamic ensemble of diverse talents united by a common goal, synergy ing creativity, innovation, and excellence to achieve success.',
    img: '/teamPhoto.png',
    href: '/contest/create-team',
  },
  {
    title: 'Host a Exhibition',
    description:
      'Experience innovation and creativity at our immersive exhibition showcasing cutting-edge art, technology, and culture',
    img: '/exhibition.png',
    href: '/exhibitions',
  },
];
