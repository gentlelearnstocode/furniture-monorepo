import { getCustomPageBySlug } from '@/lib/actions/pages';
import { DynamicPageForm } from '@/components/forms/dynamic-page-form';
import { PageHeader } from '@/components/layout/page-header';

export default async function ConstructionManufacturingPage() {
  const slug = 'construction-manufacturing';
  const page = await getCustomPageBySlug(slug);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Construction & Manufacturing'
        description='Customize the content of the Construction & Manufacturing page.'
      />
      <DynamicPageForm slug={slug} title='Construction & Manufacturing' initialData={page} />
    </div>
  );
}
