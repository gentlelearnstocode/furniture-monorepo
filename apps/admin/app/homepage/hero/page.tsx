import { getHero } from '@/lib/actions/hero';
import { HeroForm } from './components/hero-form';
import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

export default async function HeroPage() {
  const hero = await getHero();

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Homepage', href: '/homepage' },
          { label: 'Hero Section' },
        ]}
        title='Hero Management'
        description='Configure the first section users see on your store.'
      />

      <div className='max-w-6xl'>
        <HeroForm
          initialData={
            hero
              ? {
                  title: hero.title ?? undefined,
                  subtitle: hero.subtitle ?? undefined,
                  buttonText: hero.buttonText ?? undefined,
                  buttonLink: hero.buttonLink ?? undefined,
                  backgroundType: hero.backgroundType,
                  backgroundImageId: hero.backgroundImageId,
                  backgroundVideoId: hero.backgroundVideoId,
                  isActive: hero.isActive,
                  backgroundImageUrl: hero.backgroundImage?.url,
                  backgroundVideoUrl: hero.backgroundVideo?.url,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
