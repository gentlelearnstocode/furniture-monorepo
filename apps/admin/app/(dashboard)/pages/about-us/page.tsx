import { getCustomPageBySlug } from '@/lib/actions/pages';
import { DynamicPageForm } from '@/components/forms/dynamic-page-form';

export default async function AboutUsAdminPage() {
  const page = await getCustomPageBySlug('about-us');

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>About Us Page</h2>
      </div>
      <DynamicPageForm slug='about-us' title='About Us' initialData={page} />
    </div>
  );
}
