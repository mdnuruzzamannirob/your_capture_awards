import Image from 'next/image';
import Link from 'next/link';

const LogoName = ({ className = '' }: { className?: string }) => {
  return (
    <Link href="/" className={className}>
      <Image alt="Logo" src="/images/logo.png" width={195} height={75} className="h-auto" />
    </Link>
  );
};

export default LogoName;
