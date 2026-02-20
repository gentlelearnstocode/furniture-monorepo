import { getCustomPageBySlug } from '@/lib/actions/pages';
import { DynamicPageForm } from '@/components/forms/dynamic-page-form';
import { PageHeader } from '@/components/layout/page-header';

export default async function ExportsPage() {
  const slug = 'exports';
  const page = await getCustomPageBySlug(slug);

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Page Management' },
          { label: 'Exports' },
        ]}
        title='Exports'
        description='Customize the content of the Exports page.'
      />
      <DynamicPageForm slug={slug} title='Exports' initialData={page || undefined} />
    </div>
  );
}
