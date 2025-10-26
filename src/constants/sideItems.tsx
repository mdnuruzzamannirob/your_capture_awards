import { SideItems } from '@/types';
import { AiOutlineHome } from 'react-icons/ai';

export const sideItems: SideItems[] = [
  {
    name: 'Home',
    path: '/',
    icon: <AiOutlineHome className="size-4" />,
  },
  {
    name: 'Shop',
    path: '/products',
    icon: null,
  },
  {
    name: 'About',
    path: '/about',
    icon: null,
  },
];
