import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/">
      <Image alt="Site Icon" src="/icons/site-icon.png" width={34} height={34} />{' '}
    </Link>
  );
};

export default Logo;
