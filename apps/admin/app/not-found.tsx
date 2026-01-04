import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';
import { FileQuestion, MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] text-center px-4'>
      <div className='bg-gray-50 p-6 rounded-full mb-6'>
        <FileQuestion className='h-12 w-12 text-gray-400' />
      </div>
      <h1 className='text-4xl font-bold tracking-tight text-gray-900 mb-2'>404</h1>
      <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Page Not Found</h2>
      <p className='text-gray-500 max-w-md mb-8'>
        The page you are looking for does not exist or has been moved. Please check the URL or
        return to the dashboard.
      </p>
      <Link href='/'>
        <Button variant='default' className='flex items-center gap-2'>
          <MoveLeft className='h-4 w-4' />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
