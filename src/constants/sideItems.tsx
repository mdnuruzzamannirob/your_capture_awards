import { SideItems } from '@/types';
import { AiOutlineHome } from 'react-icons/ai';

export const sideItems: SideItems[] = [
  {
    name: 'Home',
    path: '/',
    icon: <AiOutlineHome className="size-4" />,
  },
  {
    name: 'Discover',
    path: '/discover',
    icon: null,
  },
  {
    name: 'Challengers',
    path: '/challengers',
    icon: null,
  },
  {
    name: 'Exhibitions',
    path: '/exhibitions',
    icon: null,
  },
  {
    name: 'Teams',
    path: '/teams',
    icon: null,
  },
  {
    name: 'Pricing',
    path: '/pricing',
    icon: null,
  },
  {
    name: 'About',
    path: '/about',
    icon: null,
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: null,
  },
];
