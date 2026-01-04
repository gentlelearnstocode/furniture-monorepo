import { Hero } from './components/hero-section';

import { FeaturedCollections } from './components/featured-collection';

export default function Home() {
  return (
    <div className='relative min-h-screen bg-white'>
      <Hero />
      <FeaturedCollections />
    </div>
  );
}
