import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { users } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { SearchInput, FilterSelect } from '@/components/ui/listing-controls';
import { UserList } from './components/user-list';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';

import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    status?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const session = await auth();

  if (session?.user?.role !== 'admin') {
    redirect('/');
  }

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const role = resolvedSearchParams.role;
  const status = resolvedSearchParams.status;

  const filters = [];
  if (role && role !== 'all') {
    filters.push(eq(users.role, role as any));
  }
  if (status && status !== 'all') {
    filters.push(eq(users.isActive, status === 'active'));
  }

  const { data: allUsers, meta } = await getListingData(users, {
    page,
    limit: 10,
    search,
    searchColumns: [users.name, users.username, users.email],
    filters,
    orderBy: (t: any, { desc }: any) => [desc(t.createdAt)],
  });

  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
  ];

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Admin Users' }]}
        title='Admin Users'
        description='Manage administrative access and roles.'
        actions={
          <Link href='/users/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add User
            </Button>
          </Link>
        }
      />

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <Card className='p-4 flex flex-col justify-between'>
          <span className='text-sm font-medium text-gray-500'>Total Users</span>
          <span className='text-2xl font-bold'>{meta.totalItems}</span>
        </Card>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <CardTitle>User List</CardTitle>
              <CardDescription>View and manage your administrative users.</CardDescription>
            </div>
            <div className='flex flex-col sm:flex-row gap-2'>
              <SearchInput placeholder='Search users...' />
              <FilterSelect
                filterKey='role'
                filterOptions={roleOptions}
                filterPlaceholder='Filter by Role'
              />
              <FilterSelect
                filterKey='status'
                filterOptions={statusOptions}
                filterPlaceholder='Filter by Status'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UserList users={allUsers} meta={meta} currentUserId={session.user.id!} />
        </CardContent>
      </Card>
    </div>
  );
}
