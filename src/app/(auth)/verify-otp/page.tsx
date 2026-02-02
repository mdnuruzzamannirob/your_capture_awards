import VerifyOtpForm from '@/components/module/auth/VerifyOtpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'verify',
  description: 'User verify page',
};

const VerifyOtpPage = () => {
  return <VerifyOtpForm />;
};

export default VerifyOtpPage;
