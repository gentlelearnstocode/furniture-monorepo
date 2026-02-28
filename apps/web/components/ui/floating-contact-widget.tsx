'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@repo/ui/lib/utils';

interface FloatingContactWidgetProps {
  contacts: {
    type: string;
    label: string | null;
    value: string;
    isActive: boolean;
  }[];
}

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  phone: <Image src='/telephone.svg' alt='Phone' width={40} height={40} />,
  telephone: <Image src='/telephone.svg' alt='Telephone' width={40} height={40} />,
  mobile: <Image src='/mobile.svg' alt='Mobile' width={40} height={40} />,
  zalo: <Image src='/zalo.svg' alt='Zalo' width={40} height={40} />,
  facebook: <Image src='/fb.svg' alt='Facebook' width={40} height={40} />,
  messenger: <Image src='/messenger.svg' alt='Messenger' width={40} height={40} />,
  email: <Image src='/email.svg' alt='Email' width={40} height={40} />,
  whatsapp: <MessageCircle size={32} strokeWidth={1.5} className='text-[#25D366]' />,
};

const getContactHref = (type: string, value: string) => {
  const cleanValue = value.replace(/\s/g, '');
  switch (type) {
    case 'phone':
    case 'telephone':
    case 'mobile':
      return `tel:${cleanValue}`;
    case 'zalo':
      return `https://zalo.me/${cleanValue}`;
    case 'email':
      return `mailto:${value}`;
    case 'whatsapp':
      return `https://wa.me/${cleanValue}`;
    default:
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
      }
      return `https://${value}`;
  }
};

export function FloatingContactWidget({ contacts }: FloatingContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const activeContacts = contacts.filter((c) => c.isActive);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (activeContacts.length === 0) return null;

  return (
    <div className='flex flex-col items-center gap-3 pointer-events-none'>
      {/* Expanded Contact Options - Stacked vertically above trigger */}
      <div
        className={cn(
          'flex flex-col items-center gap-3 transition-all duration-300 ease-out',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        {activeContacts.map((contact, index) => {
          const delay = isOpen ? index * 50 : (activeContacts.length - index - 1) * 30;

          return (
            <a
              key={index}
              href={getContactHref(contact.type, contact.value)}
              target={contact.type === 'phone' || contact.type === 'email' ? undefined : '_blank'}
              rel={
                contact.type === 'phone' || contact.type === 'email'
                  ? undefined
                  : 'noopener noreferrer'
              }
              className={cn(
                'group relative transition-all duration-300 ease-out',
                isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90',
              )}
              style={{
                transitionDelay: `${delay}ms`,
              }}
            >
              {/* Floating Label - positioned absolutely to the left */}
              <span
                className={cn(
                  'absolute right-full mr-3 top-1/2 -translate-y-1/2',
                  'px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap',
                  'bg-black/90 text-white shadow-lg',
                  'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0',
                  'transition-all duration-200 ease-out pointer-events-none',
                )}
              >
                {contact.label || contact.type}
              </span>

              {/* Contact Icon (Minimalist - Standing on its own) */}
              <div className='w-14 h-14 flex items-center justify-center transition-all duration-300 ease-out hover:scale-125'>
                {CONTACT_ICONS[contact.type] || <MessageCircle size={32} />}
              </div>
            </a>
          );
        })}
      </div>

      {/* Main Trigger Button - Original Color */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative w-14 h-14 rounded-full flex items-center justify-center text-white',
          'transition-all duration-300 ease-out',
          'shadow-xl pointer-events-auto',
          isOpen ? 'bg-black rotate-180' : 'bg-[#7B0C0C] hover:bg-[#900000] hover:scale-105',
        )}
        aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
      >
        <span className='relative z-10 transition-all duration-300'>
          {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
        </span>

        {/* Pulsing notification indicator */}
        {!isOpen && mounted && (
          <span className='absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75' />
            <span className='relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500' />
          </span>
        )}
      </button>
    </div>
  );
}
