import { getHero } from '@/lib/actions/hero';
import Link from 'next/link';
import { HeroForm } from './components/hero-form';

export const dynamic = 'force-dynamic';

export default async function HeroPage() {
  const hero = await getHero();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <nav className='flex items-center text-sm text-gray-500 mb-1'>
            <Link href='/' className='hover:text-gray-900 transition-colors'>
              Dashboard
            </Link>
            <span className='mx-2'>/</span>
            <Link href='/homepage' className='hover:text-gray-900 transition-colors'>
              Homepage
            </Link>
            <span className='mx-2'>/</span>
            <span className='font-medium text-gray-900'>Hero Section</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Hero Management</h1>
          <p className='text-base text-gray-500 mt-1'>
            Configure the first section users see on your store.
          </p>
        </div>
      </div>

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
