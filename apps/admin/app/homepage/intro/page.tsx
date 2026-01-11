import { db } from '@repo/database';
import Link from 'next/link';
import { IntroForm } from './components/intro-form';

export const dynamic = 'force-dynamic';

export default async function IntroPage() {
  const intro = await db.query.siteIntros.findFirst({
    orderBy: (intros, { desc }) => [desc(intros.updatedAt)],
    with: {
      introImage: true,
      backgroundImage: true,
    },
  });

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
            <span className='font-medium text-gray-900'>Intro Section</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Intro Management</h1>
          <p className='text-base text-gray-500 mt-1'>
            Customize the introduction section of your store landing page.
          </p>
        </div>
      </div>

      <div className='max-w-6xl'>
        <IntroForm
          initialData={
            intro
              ? {
                  title: intro.title,
                  subtitle: intro.subtitle || '',
                  contentHtml: intro.contentHtml,
                  introImageId: intro.introImageId,
                  backgroundImageId: intro.backgroundImageId,
                  isActive: intro.isActive,
                  introImageUrl: intro.introImage?.url,
                  backgroundImageUrl: intro.backgroundImage?.url,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
