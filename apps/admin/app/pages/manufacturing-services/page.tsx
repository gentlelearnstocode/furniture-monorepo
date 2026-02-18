import { getCustomPageBySlug } from '@/lib/actions/pages';
import { DynamicPageForm } from '@/components/forms/dynamic-page-form';
import { PageHeader } from '@/components/layout/page-header';

export default async function ManufacturingServicesPage() {
  const slug = 'manufacturing-services';
  const page = await getCustomPageBySlug(slug);

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Page Management' },
          { label: 'Manufacturing Services' },
        ]}
        title='Manufacturing Services'
        description='Customize the content of the Manufacturing Services page.'
      />
      <DynamicPageForm slug={slug} title='Manufacturing Services' initialData={page} />
    </div>
  );
}
