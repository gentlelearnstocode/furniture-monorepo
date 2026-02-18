import { db } from '@repo/database';
import { IntroForm } from './components/intro-form';
import { PageHeader } from '@/components/layout/page-header';

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
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Homepage', href: '/homepage' },
          { label: 'Intro Section' },
        ]}
        title='Intro Management'
        description='Customize the introduction section of your store landing page.'
      />

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
