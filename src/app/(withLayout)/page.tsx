import About from '@/components/module/home/About';
import Banner from '@/components/module/home/Banner';
import Discover from '@/components/module/home/Discover';
import Features from '@/components/module/home/Features';
import Memories from '@/components/module/home/Memories';
import { decodeToken } from '@/utils/decodeToken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value ?? null;

  const decoded = decodeToken(token);
  const role = decoded?.role;

  if (role === 'USER' || role === 'ADMIN') {
    redirect('/contest/joined');
  }

  return (
    <>
      <Banner />
      <About />
      <Memories />
      <Discover />
      <Features />
    </>
  );
}
