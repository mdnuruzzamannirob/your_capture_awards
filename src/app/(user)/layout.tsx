import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { decodeToken } from '@/utils/decodeToken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
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
      <Header />
      <main className="min-h-dvh">{children}</main>
      <Footer />
    </>
  );
};

export default UserLayout;
