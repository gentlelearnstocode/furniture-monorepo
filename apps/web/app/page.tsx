import { Hero } from './components/Hero';
import { FeaturedCollections } from './components/FeaturedCollections';

export default function Home() {
  return (
    <div className='relative min-h-screen bg-white'>
      <Hero />
      <FeaturedCollections />
    </div>
  );
}
