import About from '@/components/home/About';
import Banner from '@/components/home/Banner';
import Discover from '@/components/home/Discover';
import Features from '@/components/home/Features';
import Memories from '@/components/home/Memories';
import { decodeToken } from '@/utils/decodeToken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value ?? null;

  const decoded = decodeToken(token);
  const role = decoded?.role;

  if (role == 'USER') {
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
