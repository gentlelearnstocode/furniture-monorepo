import { getService } from '@/lib/actions/service';
import { notFound } from 'next/navigation';
import { ServiceForm } from '../components/service-form';
import { PageProps } from '@/types';
import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

export default async function EditServicePage({ params }: PageProps<{ id: string }>) {
  const { id } = await params;

  if (id === 'new') {
    return notFound(); // Should be handled by /new/page.tsx
  }

  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Edit' },
        ]}
        title='Edit Service'
        description='Update service details.'
      />
      <div className='max-w-6xl'>
        <ServiceForm
          initialData={{
            ...service,
            imageUrl: service.image?.url,
          }}
        />
      </div>
    </div>
  );
}
