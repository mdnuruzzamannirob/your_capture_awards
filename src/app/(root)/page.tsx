import About from '@/components/home/About';
import Banner from '@/components/home/Banner';
import Discover from '@/components/home/Discover';
import Memories from '@/components/home/Memories';

export default function HomePage() {
  return (
    <main>
      <Banner />
      <About />
      <Memories />
      <Discover />
    </main>
  );
}
