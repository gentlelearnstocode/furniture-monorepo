'use client';

import { ServiceForm } from '../components/service-form';
import { PageHeader } from '@/components/layout/page-header';

export default function NewServicePage() {
  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Create' },
        ]}
        title='New Service'
        description='Add a new service to your business offering.'
      />
      <div className='max-w-6xl'>
        <ServiceForm />
      </div>
    </div>
  );
}
