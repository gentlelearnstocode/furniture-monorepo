import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { ProjectList } from './components/project-list';
import { eq } from 'drizzle-orm';
import { PageHeader } from '@/components/layout/page-header';
import { StatsCard } from '@/components/listing/stats-card';
import { ListingCard } from '@/components/listing/listing-card';
import { parseListingParams } from '@/lib/listing-params';
import { STATUS_FILTER_OPTIONS } from '@/constants';
import { type Project } from '@repo/shared';

export const dynamic = 'force-dynamic';

interface ProjectsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { page, search, status } = await parseListingParams(searchParams, {
    filterKeys: ['status'],
  });

  const filters = [];
  if (status && status !== 'all') {
    filters.push(eq(projects.isActive, status === 'active'));
  }

  const { data: allProjects, meta } = await getListingData<Project>(projects, {
    page,
    limit: 10,
    search,
    searchColumns: [projects.title, projects.slug],
    filters,
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    with: {
      image: true,
      createdBy: true,
    },
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Projects' }]}
        title='Projects'
        description='Manage your project showcases.'
        actions={
          <Link href='/projects/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Project
            </Button>
          </Link>
        }
      />

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <StatsCard label='Total Projects' value={meta.totalItems} />
      </div>

      <ListingCard
        title='Project List'
        description='View and manage your projects.'
        searchPlaceholder='Search projects...'
        filters={[
          { key: 'status', options: STATUS_FILTER_OPTIONS, placeholder: 'Filter by Status' },
        ]}
      >
        <ProjectList projects={allProjects} meta={meta} />
      </ListingCard>
    </div>
  );
}
