import { ShowroomPageForm } from '@/components/forms/showroom-page-form';
import { ShowroomManager } from '@/components/showrooms/showroom-manager';
import { getCustomPageBySlug } from '@/lib/actions/pages';
import { getShowrooms } from '@/lib/actions/showrooms';
import { Separator } from '@repo/ui/ui/separator';
import { PageHeader } from '@/components/layout/page-header';

export const metadata = {
  title: 'Showroom & Factory | Admin',
};

export default async function ShowroomFactoryPage() {
  const pageSlug = 'showroom-factory';
  const pageData = await getCustomPageBySlug(pageSlug);
  const showrooms = await getShowrooms();

  return (
    <div className='space-y-10 pb-20'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Page Management' },
          { label: 'Showroom & Factory' },
        ]}
        title='Showroom & Factory Page'
        description='Manage the page introduction and showroom locations.'
      />

      <div className='space-y-6'>
        <div className='bg-white rounded-lg border border-brand-neutral-200 p-6 shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Page Header & Intro</h2>
          <ShowroomPageForm slug={pageSlug} initialData={pageData || undefined} />
        </div>
      </div>

      <Separator />

      <div className='bg-white rounded-lg border border-brand-neutral-200 p-6 shadow-sm'>
        <ShowroomManager initialItems={showrooms} />
      </div>
    </div>
  );
}
