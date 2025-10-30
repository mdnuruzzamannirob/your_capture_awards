import ContestHeader from '@/components/layout/ContestHeader';
import { decodeToken } from '@/utils/decodeToken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ContestLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/signin');
  }

  const decoded = decodeToken(token);
  const role = decoded?.role;

  if (!decoded) {
    redirect('/signin');
  }

  if (role !== 'USER' && role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <>
      <ContestHeader />
      {children}
    </>
  );
};

export default ContestLayout;
