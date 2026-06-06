import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';

const LogoName = ({ className = '' }: { className?: string }) => {
  return (
    <Link href="/" className={cn('w-44', className)}>
      <Image alt="Logo" src="/images/logo.png" width={192} height={75} className="h-auto w-full" />
    </Link>
  );
};

export default LogoName;
