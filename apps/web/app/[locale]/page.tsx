import { Hero } from './components/hero-section';
import { FeaturedCatalogs } from './components/featured-catalogs';
import { IntroSection } from './components/intro-section';
// import { ServicesSection } from './components/services-section';
import { SaleSection } from './components/sale-section';
import { ProjectsSection } from './components/projects-section';
import { RunningBanner } from './components/running-banner';
import { BlogsSection } from './components/blogs-section';
import { getHeroData, getHomepageSaleProducts, getSaleSettings } from '@/lib/queries';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

// Revalidate every 30 minutes (hero content may change occasionally)
export const revalidate = 1800;

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('home.title'),
    description: t('home.description'),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [hero, saleProducts, saleSettings] = await Promise.all([
    getHeroData(),
    getHomepageSaleProducts(),
    getSaleSettings(),
  ]);

  return (
    <div className='relative min-h-screen bg-white'>
      <Hero
        data={
          hero
            ? {
                title: hero.title,
                titleVi: hero.titleVi,
                subtitle: hero.subtitle,
                subtitleVi: hero.subtitleVi,
                buttonText: hero.buttonText,
                buttonTextVi: hero.buttonTextVi,
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
      {saleSettings && <SaleSection products={saleProducts} settings={saleSettings} />}
      {/* <ServicesSection /> */}
      <FeaturedCatalogs />
      <RunningBanner />
      <ProjectsSection />
      <BlogsSection />
    </div>
  );
}
