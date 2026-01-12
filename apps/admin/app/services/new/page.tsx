'use client';

import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';
import { ServiceForm } from '../components/service-form';

export default function NewServicePage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/services'>
          <Button variant='outline' size='icon'>
            <MoveLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>New Service</h1>
          <p className='text-sm text-gray-500'>Add a new service to your business offering.</p>
        </div>
      </div>
      <div className='max-w-6xl'>
        <ServiceForm />
      </div>
    </div>
  );
}
