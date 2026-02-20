import { getCustomPageBySlug } from '@/lib/actions/pages';
import { DynamicPageForm } from '@/components/forms/dynamic-page-form';
import { PageHeader } from '@/components/layout/page-header';

export default async function AboutUsAdminPage() {
  const page = await getCustomPageBySlug('about-us');

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Page Management' },
          { label: 'About Us' },
        ]}
        title='About Us Page'
        description='Customize the content of the About Us page.'
      />
      <DynamicPageForm slug='about-us' title='About Us' initialData={page || undefined} />
    </div>
  );
}
