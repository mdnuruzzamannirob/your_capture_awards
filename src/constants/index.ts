import { DiscoverItem, FeatureItem, MemoriesImage, NavLink } from '@/types';

export const navLinks: NavLink[] = [
  {
    name: 'Contest',
    href: '/contest',
    tags: ['/contest', '/joined', '/open', '/closed', '/completed', '/upcoming'],
  },
  { name: 'Teams', href: '/teams' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About Us', href: '/about' },
  // { name: 'Discover', href: '/discover' },
  // { name: 'Contact', href: '/contact' },
];

export const memoriesImages: MemoriesImage[] = [
  {
    image: '/images/photographer.png',
  },
  {
    image: '/images/photographer.png',
  },
  {
    image: '/images/photographer.png',
  },
  {
    image: '/images/photographer.png',
  },
  {
    image: '/images/photographer.png',
  },
];

export const discoverItems: DiscoverItem[] = [
  {
    key: 'experiment',
    label: 'Experiment',
    sub: 'WITH YOUR PHOTOS',
    img: '/icons/experiment.png',
  },
  {
    key: 'promote',
    label: 'Promote',
    sub: 'SHARE YOUR CREATIONS',
    img: '/icons/promote.png',
  },
  {
    key: 'charges',
    label: 'Engage',
    sub: 'CONNECT WITH YOUR AUDIENCE',
    img: '/icons/votes.png',
  },
  {
    key: 'keys',
    label: 'Unlock',
    sub: 'DISCOVER NEW POSSIBILITIES',
    img: '/icons/keys.png',
  },
];

export const FeatureItems: FeatureItem[] = [
  {
    title: 'Photographer of the year',
    description:
      'Capturing moments that transcend time, Photographer of the Year unveils the world"s beauty through a lens of innovation and emotion.',
    img: '/images/POTY.png',
    href: '/photographer-of-the-year',
  },
  {
    title: 'Create a Team',
    description:
      'A dynamic ensemble of diverse talents united by a common goal, synergy ing creativity, innovation, and excellence to achieve success.',
    img: '/images/teamPhoto.png',
    href: '/contest/create-team',
  },
  {
    title: 'Host a Exhibition',
    description:
      'Experience innovation and creativity at our immersive exhibition showcasing cutting-edge art, technology, and culture',
    img: '/images/exhibition.png',
    href: '/exhibitions',
  },
];
