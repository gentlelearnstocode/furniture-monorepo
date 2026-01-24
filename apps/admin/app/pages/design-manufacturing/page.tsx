import { getCustomPageBySlug } from '@/lib/actions/pages';
import { DynamicPageForm } from '@/components/forms/dynamic-page-form';
import { PageHeader } from '@/components/layout/page-header';

export default async function DesignManufacturingPage() {
  const slug = 'design-manufacturing';
  const page = await getCustomPageBySlug(slug);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Design & Manufacturing'
        description='Customize the content of the Design & Manufacturing page.'
      />
      <DynamicPageForm slug={slug} title='Design & Manufacturing' initialData={page} />
    </div>
  );
}
