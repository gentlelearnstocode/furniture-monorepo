'use client';

import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';
import { ProjectForm } from '../components/project-form';

export default function NewProjectPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/projects'>
          <Button variant='outline' size='icon'>
            <MoveLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>New Project</h1>
          <p className='text-sm text-gray-500'>Add a new project showcase.</p>
        </div>
      </div>
      <div className='max-w-6xl'>
        <ProjectForm />
      </div>
    </div>
  );
}
