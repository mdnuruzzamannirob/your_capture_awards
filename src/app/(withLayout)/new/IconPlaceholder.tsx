import { cn } from '@/utils/cn';
import {
  Aperture,
  Award,
  Coins,
  FileCheck,
  Hash,
  Hourglass,
  ImageIcon,
  ImageOff,
  ImagePlus,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
} from 'lucide-react';

const ICONS: Record<string, typeof User> = {
  photo: ImageIcon,
  'photo-x': ImageOff,
  'photo-plus': ImagePlus,
  'photo-star': Sparkles,
  'shield-star': ShieldCheck,
  award: Award,
  votes: Hash,
  ended: Hourglass,
  awards: Trophy,
  coin: Coins,
  medal: Medal,
  trophy: Trophy,
  hash: Hash,
  'file-check': FileCheck,
  user: User,
  aperture: Aperture,
};

export function IconPlaceholder({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const Icon = ICONS[name] ?? ImageIcon;
  return (
    <Icon
      className={cn('text-muted-foreground', size === 'sm' ? 'h-4 w-4' : 'h-6 w-6')}
      aria-hidden="true"
    />
  );
}
