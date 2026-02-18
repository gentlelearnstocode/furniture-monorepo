import { getCustomPageBySlug } from '@/lib/actions/pages';
import { DynamicPageForm } from '@/components/forms/dynamic-page-form';
import { PageHeader } from '@/components/layout/page-header';

export default async function DesignProjectPage() {
  const slug = 'design-project';
  const page = await getCustomPageBySlug(slug);

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Page Management' },
          { label: 'Design & Project' },
        ]}
        title='Design & Project'
        description='Customize the content of the Design & Project page.'
      />
      <DynamicPageForm slug={slug} title='Design & Project' initialData={page} />
    </div>
  );
}
