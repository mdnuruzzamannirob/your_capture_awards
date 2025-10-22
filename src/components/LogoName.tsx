import Image from 'next/image';
import Link from 'next/link';

const LogoName = () => {
  return (
    <Link href="/">
      <Image alt="Logo" src="/logo.png" width={200} height={100} className="h-auto" />
    </Link>
  );
};

export default LogoName;
