'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { submitFooterSubscribe } from './footer-actions';

interface Props {
  placeholder: string;
  buttonText: string;
}

export function FooterSubscribeForm({ placeholder, buttonText }: Props) {
  const [isPending, startTransition] = useTransition();
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contact.trim()) return;

    startTransition(async () => {
      const result = await submitFooterSubscribe({ contact: contact.trim() });
      if (result.success) {
        toast.success(result.message);
        setContact('');
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form className='flex flex-col sm:flex-row gap-2' onSubmit={handleSubmit}>
      <input
        type='text'
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder={placeholder}
        disabled={isPending}
        required
        className='flex-1 px-4 py-3 text-sm border border-gray-300 bg-white focus:outline-none focus:border-brand-primary-600 placeholder:text-gray-400 disabled:opacity-50'
      />
      <button
        type='submit'
        disabled={isPending}
        className='px-6 py-3 bg-brand-primary-600 text-white text-sm font-semibold uppercase tracking-wider hover:bg-brand-primary-700 transition-colors whitespace-nowrap disabled:opacity-50 flex items-center justify-center min-w-[120px]'
      >
        {isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : buttonText}
      </button>
    </form>
  );
}
