import { getProject } from '@/lib/actions/project';
import { notFound } from 'next/navigation';
import { ProjectForm } from '../components/project-form';
import { PageProps } from '@/types';
import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: PageProps<{ id: string }>) {
  const { id } = await params;

  if (id === 'new') {
    return notFound();
  }

  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: 'Edit' },
        ]}
        title='Edit Project'
        description='Update project details.'
      />
      <div className='max-w-6xl'>
        <ProjectForm
          initialData={{
            ...project,
            imageUrl: project.image?.url,
          }}
        />
      </div>
    </div>
  );
}
