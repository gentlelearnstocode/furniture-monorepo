'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, Facebook, Mail, MessageSquare } from 'lucide-react';
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
  phone: <Phone size={24} strokeWidth={1.5} />,
  zalo: <span className='text-sm font-bold tracking-tighter leading-none'>Zalo</span>,
  facebook: <Facebook size={24} strokeWidth={1.5} />,
  messenger: <MessageSquare size={24} strokeWidth={1.5} />,
  email: <Mail size={24} strokeWidth={1.5} />,
  whatsapp: <MessageSquare size={24} strokeWidth={1.5} />,
};

const getContactHref = (type: string, value: string) => {
  const cleanValue = value.replace(/\s/g, '');
  switch (type) {
    case 'phone':
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
  const [isOpen, setIsOpen] = useState(false);
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

              {/* Contact Button with Solid Colors */}
              <div
                className='w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:shadow-xl'
                style={{
                  backgroundColor:
                    contact.type === 'phone'
                      ? '#C00000'
                      : contact.type === 'zalo'
                        ? '#0068FF'
                        : contact.type === 'facebook'
                          ? '#1877F2'
                          : contact.type === 'messenger'
                            ? '#00B2FF'
                            : contact.type === 'email'
                              ? '#EA4335'
                              : contact.type === 'whatsapp'
                                ? '#25D366'
                                : '#444444',
                }}
              >
                {CONTACT_ICONS[contact.type] || <MessageCircle size={24} />}
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
