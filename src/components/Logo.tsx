import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/">
      <Image alt="Site Icon" src="/site-icon.png" />{' '}
    </Link>
  );
};

export default Logo;
