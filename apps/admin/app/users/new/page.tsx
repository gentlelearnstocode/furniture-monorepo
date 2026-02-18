export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UserForm } from '../components/user-form';
import { PageHeader } from '@/components/layout/page-header';

export default async function NewUserPage() {
  const session = await auth();

  if (session?.user?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className='space-y-6 max-w-2xl'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Admin Users', href: '/users' },
          { label: 'Create' },
        ]}
        title='Create New User'
        description='Grant access to a new team member.'
      />

      <div className='bg-white border border-brand-neutral-200 rounded-lg p-6 shadow-sm'>
        <UserForm />
      </div>
    </div>
  );
}
