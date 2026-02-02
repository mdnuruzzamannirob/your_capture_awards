import About from '@/components/module/home/About';
import Banner from '@/components/module/home/Banner';
import Discover from '@/components/module/home/Discover';
import Features from '@/components/module/home/Features';
import Memories from '@/components/module/home/Memories';
import { getUser } from '@/lib/server/getUser';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { user } = await getUser();

  // If authenticated, redirect to joined contests
  if (user) {
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
