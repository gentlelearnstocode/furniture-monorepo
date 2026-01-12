import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { projects } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { ListingControls } from '@/components/ui/listing-controls';
import { ProjectList } from './components/project-list';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

interface ProjectsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const status = resolvedSearchParams.status;

  const filters = [];
  if (status && status !== 'all') {
    filters.push(eq(projects.isActive, status === 'active'));
  }

  const { data: allProjects, meta } = await getListingData(projects, {
    page,
    limit: 10,
    search,
    searchColumns: [projects.title, projects.slug],
    filters,
    orderBy: (t: any, { desc }: any) => [desc(t.createdAt)],
    with: {
      image: true,
    },
  });

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <nav className='flex items-center text-sm text-gray-500 mb-1'>
            <Link href='/' className='hover:text-gray-900 transition-colors'>
              Dashboard
            </Link>
            <span className='mx-2'>/</span>
            <span className='font-medium text-gray-900'>Projects</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Projects</h1>
          <p className='text-base text-gray-500 mt-1'>Manage your project showcases.</p>
        </div>
        <div className='flex gap-3'>
          <Link href='/projects/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <Card className='p-4 flex flex-col justify-between'>
          <span className='text-sm font-medium text-gray-500'>Total Projects</span>
          <span className='text-2xl font-bold'>{meta.totalItems}</span>
        </Card>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <CardTitle>Project List</CardTitle>
              <CardDescription>View and manage your projects.</CardDescription>
            </div>
            <div className='flex flex-col sm:flex-row gap-2'>
              <ListingControls
                placeholder='Search projects...'
                filterKey='status'
                filterOptions={statusOptions}
                filterPlaceholder='Filter by Status'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProjectList projects={allProjects} meta={meta} />
        </CardContent>
      </Card>
    </div>
  );
}
