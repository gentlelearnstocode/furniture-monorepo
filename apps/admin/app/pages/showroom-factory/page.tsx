import { ShowroomPageForm } from '@/components/forms/showroom-page-form';
import { ShowroomManager } from '@/components/showrooms/showroom-manager';
import { getCustomPageBySlug } from '@/lib/actions/pages';
import { getShowrooms } from '@/lib/actions/showrooms';
import { Separator } from '@repo/ui/ui/separator';

export const metadata = {
  title: 'Showroom & Factory | Admin',
};

export default async function ShowroomFactoryPage() {
  const pageSlug = 'showroom-factory';
  const pageData = await getCustomPageBySlug(pageSlug);
  const showrooms = await getShowrooms();

  return (
    <div className='space-y-10 pb-20'>
      <div>
        <h1 className='text-3xl font-bold mb-6'>Showroom & Factory Page</h1>
        <p className='text-muted-foreground mb-8'>
          Manage the page introduction and showroom locations.
        </p>

        <div className='bg-white rounded-lg border p-6 shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Page Header & Intro</h2>
          <ShowroomPageForm slug={pageSlug} initialData={pageData} />
        </div>
      </div>

      <Separator />

      <div className='bg-white rounded-lg border p-6 shadow-sm'>
        <ShowroomManager initialItems={showrooms} />
      </div>
    </div>
  );
}
