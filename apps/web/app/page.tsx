import { Hero } from './components/hero-section';
import { FeaturedCollections } from './components/featured-collection';
import { IntroSection } from './components/intro-section';
import { ServicesSection } from './components/services-section';
import { ProjectsSection } from './components/projects-section';
import { BlogsSection } from './components/blogs-section';
import { db } from '@repo/database';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const hero = await db.query.siteHeros.findFirst({
    where: (heros, { eq }) => eq(heros.isActive, true),
    orderBy: (heros, { desc }) => [desc(heros.updatedAt)],
    with: {
      backgroundImage: true,
      backgroundVideo: true,
    },
  });

  return (
    <div className='relative min-h-screen bg-white'>
      <Hero
        data={
          hero
            ? {
                title: hero.title,
                subtitle: hero.subtitle,
                buttonText: hero.buttonText,
                buttonLink: hero.buttonLink,
                backgroundType: hero.backgroundType,
                backgroundImageUrl: hero.backgroundImage?.url,
                backgroundVideoUrl: hero.backgroundVideo?.url,
              }
            : {
                title: 'Excellence in \n Craftsmanship',
                subtitle: 'Timeless furniture for your home since 1997.',
                buttonText: 'Explore Collections',
                buttonLink: '/collections',
                backgroundType: 'image',
              }
        }
      />
      <IntroSection />
      <ServicesSection />
      <FeaturedCollections />
      <ProjectsSection />
      <BlogsSection />
    </div>
  );
}
