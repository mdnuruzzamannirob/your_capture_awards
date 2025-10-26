import About from '@/components/home/About';
import Banner from '@/components/home/Banner';
import Discover from '@/components/home/Discover';
import Features from '@/components/home/Features';
import Memories from '@/components/home/Memories';

export default function HomePage() {
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
