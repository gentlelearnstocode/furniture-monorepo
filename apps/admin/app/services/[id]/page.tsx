import { getService } from '@/lib/actions/service';
import { notFound } from 'next/navigation';
import { ServiceForm } from '../components/service-form';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';
import { PageProps } from '@/types';

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
      <div className='flex items-center gap-4'>
        <Link href='/services'>
          <Button variant='outline' size='icon'>
            <MoveLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Edit Service</h1>
          <p className='text-sm text-gray-500'>Update service details.</p>
        </div>
      </div>
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
