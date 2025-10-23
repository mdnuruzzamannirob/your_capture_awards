import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm Password',
  description: 'Confirm Password page',
};

const ConfirmPasswordPage = () => {
  return <ResetPasswordForm />;
};

export default ConfirmPasswordPage;
