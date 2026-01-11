'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Web App Error:', error);
  }, [error]);

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center'>
      <div className='max-w-md w-full'>
        <span className='text-[10px] tracking-[0.3em] font-medium text-gray-400 uppercase mb-4 block'>
          Unexpected Error
        </span>
        <h1 className='text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight'>
          Something went <br /> wrong.
        </h1>
        <p className='text-gray-500 mb-10 text-sm leading-relaxed max-w-[280px] mx-auto'>
          We apologize for the inconvenience. Our team has been notified and we are working to fix
          this.
        </p>

        <div className='flex flex-col gap-4 items-center'>
          <button
            onClick={() => reset()}
            className='w-full max-w-[220px] bg-black text-white px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all flex items-center justify-center gap-2'
          >
            <RefreshCcw size={14} />
            Try Again
          </button>

          <Link
            href='/'
            className='text-[10px] tracking-[0.2em] text-gray-400 hover:text-black transition-colors uppercase flex items-center gap-2 mt-4'
          >
            <ArrowLeft size={12} />
            Return to Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className='mt-12 p-4 bg-gray-50 rounded-sm border border-gray-100 text-left overflow-auto max-h-40'>
            <p className='text-[10px] font-mono text-red-500 break-all'>{error.message}</p>
          </div>
        )}
      </div>

      <div className='mt-20'>
        <div className='flex flex-col items-center opacity-20'>
          <span className='text-[10px] italic tracking-[0.2em] font-serif mb-[-4px]'>The</span>
          <span className='text-xl font-bold tracking-[0.1em] border-t border-b border-black py-0.5 px-2'>
            FURNITURE of
          </span>
          <span className='text-3xl font-bold mt-[-5px] leading-tight'>TA</span>
        </div>
      </div>
    </div>
  );
}
