import { MdLocationCity, MdOutlineMail } from 'react-icons/md';
import LogoName from '../LogoName';
import Link from 'next/link';
import { FaFacebookF, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="border-primary mt-20 border-t py-20">
      <div className="container flex items-center justify-center gap-20">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <p className="border-primary text-primary flex items-center justify-center rounded-full border p-3">
              <MdOutlineMail className="size-5" />
            </p>
            <div className="space-y-1">
              <h4 className="text-lg font-medium">Email Drop</h4>
              <p className="">captureaward@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="border-primary text-primary flex items-center justify-center rounded-full border p-3">
              <MdLocationCity className="size-5" />
            </p>
            <div className="space-y-1">
              <h4 className="text-lg font-medium">Location From</h4>
              <p className="">Moon-Sun, 9:00 AM -9:00 PM</p>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="border-primary h-60 border-r" />

        <div className="space-y-5">
          <LogoName className="scale-125" />
          <p className="text-center">
            There are many variations <br /> of product of Image.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="bg-primary text-background flex items-center justify-center rounded-full p-3"
            >
              <FaXTwitter className="size-5" />
            </Link>{' '}
            <Link
              href="/"
              className="bg-primary text-background flex items-center justify-center rounded-full p-3"
            >
              <FaFacebookF className="size-5" />
            </Link>
            <Link
              href="/"
              className="bg-primary text-background flex items-center justify-center rounded-full p-3"
            >
              <FaLinkedin className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
