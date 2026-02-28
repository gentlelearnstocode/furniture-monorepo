import { Link } from '@/i18n/routing';
import { Button } from '@repo/ui/ui/button';
import { MoveRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] text-center px-6'>
      <div className='mb-8 overflow-hidden'>
        <h1 className='text-[12rem] font-bold leading-none tracking-tighter text-gray-100 select-none'>
          404
        </h1>
      </div>

      <div className='relative -mt-32'>
        <h2 className='text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-4'>
          Lost in Style?
        </h2>
        <p className='text-gray-600 max-w-sm mx-auto mb-10 leading-relaxed'>
          The masterpiece you're looking for seems to have been moved or doesn't exist. Let's get
          you back to our collections.
        </p>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Link href='/'>
            <Button
              size='lg'
              className='rounded-none px-8 py-6 text-base tracking-wide bg-gray-900 border-gray-900 hover:bg-gray-800 transition-all duration-300'
            >
              Return to Shop
            </Button>
          </Link>
          <Link href='/collections'>
            <Button
              variant='outline'
              size='lg'
              className='rounded-none px-8 py-6 text-base tracking-wide border-gray-300 hover:border-gray-900 transition-all duration-300 group'
            >
              View Collections
              <MoveRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Button>
          </Link>
        </div>
      </div>

      <div className='mt-20 border-t border-gray-100 pt-8 w-full max-w-2xl text-[10px] uppercase tracking-[0.2em] text-gray-400'>
        Thiên Ấn Furniture &copy; 1997 - {new Date().getFullYear()}
      </div>
    </div>
  );
}
