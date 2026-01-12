import { getProject } from '@/lib/actions/project';
import { notFound } from 'next/navigation';
import { ProjectForm } from '../components/project-form';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';
import { PageProps } from '@/types';

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
      <div className='flex items-center gap-4'>
        <Link href='/projects'>
          <Button variant='outline' size='icon'>
            <MoveLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Edit Project</h1>
          <p className='text-sm text-gray-500'>Update project details.</p>
        </div>
      </div>
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
