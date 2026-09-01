import { MdLocationCity, MdOutlineMail } from 'react-icons/md';
import LogoName from '../LogoName';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-border mt-20 border-t py-20">
      <div className="container flex flex-col-reverse items-center justify-center gap-20 md:flex-row">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <p className="border-border text-primary bg-surface-secondary flex items-center justify-center rounded-full border p-3">
              <MdOutlineMail className="size-5" />
            </p>
            <div className="space-y-1">
              <h4 className="text-lg font-medium">Email Drop</h4>
              <p className="">info@yourcaptureawards.org</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="border-border text-primary bg-surface-secondary flex items-center justify-center rounded-full border p-3">
              <MdLocationCity className="size-5" />
            </p>
            <div className="space-y-1">
              <h4 className="text-lg font-medium">Location From</h4>
              <p className="">Moon-Sun, 9:00 AM -9:00 PM</p>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="border-border hidden h-40 border-r md:block" />

        {/* Quick Links Column */}
        <div className="flex flex-col items-center gap-3 md:items-start">
          <h4 className="text-lg font-semibold">Quick Links</h4>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy-policy"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        {/* divider */}
        <div className="border-border hidden h-40 border-r md:block" />

        <div className="space-y-5">
          <LogoName className="scale-125" />
          <p className="text-center">
            There are many variations <br /> of product of Image.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="mailto:info@yourcaptureawards.org"
              className="bg-primary text-primary-foreground flex items-center justify-center rounded-full p-3"
            >
              <MdOutlineMail className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
