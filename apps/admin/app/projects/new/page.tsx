'use client';

import { ProjectForm } from '../components/project-form';
import { PageHeader } from '@/components/layout/page-header';

export default function NewProjectPage() {
  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: 'Create' },
        ]}
        title='New Project'
        description='Add a new project showcase.'
      />
      <div className='max-w-6xl'>
        <ProjectForm />
      </div>
    </div>
  );
}
