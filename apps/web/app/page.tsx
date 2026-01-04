import { Hero } from './components/hero-section';

import { FeaturedCollections } from './components/featured-collection';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className='relative min-h-screen bg-white'>
      <Hero />
      <FeaturedCollections />
    </div>
  );
}
