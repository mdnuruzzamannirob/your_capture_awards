import ResetPasswordForm from '@/components/module/auth/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm Password',
  description: 'Confirm Password page',
};

const ResetPasswordPage = () => {
  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
