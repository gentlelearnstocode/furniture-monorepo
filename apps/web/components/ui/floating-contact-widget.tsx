'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Facebook, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';

interface FloatingContactWidgetProps {
  contacts: {
    type: string;
    label: string | null;
    value: string;
    isActive: boolean;
  }[];
}

const TelephoneIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 40 40'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M24 17.3337C24.0997 17.3338 24.1981 17.356 24.2881 17.3992C24.3782 17.4424 24.458 17.5057 24.5205 17.5837L29.8535 24.2488C29.9481 24.367 29.9991 24.5144 29.999 24.6658V27.3318C29.999 28.0389 29.7187 28.7175 29.2188 29.2175C28.7187 29.7175 28.0402 29.9987 27.333 29.9988H12.667C11.9598 29.9988 11.2813 29.7175 10.7813 29.2175C10.2812 28.7175 10 28.0389 10 27.3318V24.6658C9.99994 24.5144 10.0509 24.367 10.1455 24.2488L15.4795 17.5837C15.542 17.5057 15.6208 17.4424 15.7109 17.3992C15.8011 17.3559 15.9 17.3337 16 17.3337H24ZM21.0205 20.8689C20.5333 20.6671 19.9968 20.6147 19.4795 20.7175C18.9623 20.8204 18.4872 21.0742 18.1143 21.447C17.7414 21.8198 17.4877 22.2952 17.3848 22.8123C17.2819 23.3295 17.3343 23.8661 17.5361 24.3533C17.738 24.8404 18.0801 25.2566 18.5186 25.5496C18.957 25.8425 19.4727 25.9988 20 25.9988C20.7071 25.9987 21.3857 25.7185 21.8857 25.2185C22.3858 24.7185 22.666 24.0399 22.666 23.3328C22.666 22.8054 22.5098 22.2898 22.2168 21.8513C21.9238 21.4129 21.5077 21.0707 21.0205 20.8689ZM27.0195 10.0007C27.5101 10.0007 27.9916 10.1357 28.4102 10.3914C28.8525 10.6805 29.2048 11.0896 29.4248 11.5701C29.6447 12.0504 29.7244 12.5836 29.6543 13.1072L29.3984 15.406C29.3804 15.5691 29.3029 15.7204 29.1807 15.8298C29.0585 15.9392 28.9003 15.9997 28.7363 15.9998H25.8535C25.7049 15.9998 25.5605 15.9496 25.4434 15.8582C25.3263 15.7667 25.2431 15.639 25.207 15.4949L24.666 13.3337H15.333L14.792 15.4949C14.7559 15.639 14.6727 15.7667 14.5557 15.8582C14.4385 15.9496 14.2941 15.9998 14.1455 15.9998H11.2666C11.1018 16.0008 10.9424 15.9404 10.8193 15.8308C10.6962 15.7213 10.6177 15.5698 10.5996 15.406L10.3291 12.9617C10.2744 12.4732 10.356 11.979 10.5645 11.5339C10.8033 11.0627 11.1707 10.6685 11.624 10.3972C12.0773 10.126 12.5979 9.98863 13.126 10.0007H27.0195Z'
      fill='currentColor'
    />
  </svg>
);

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  phone: <TelephoneIcon size={24} />,
  telephone: <TelephoneIcon size={24} />,
  mobile: <Smartphone size={24} strokeWidth={1.5} />,
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

              {/* Contact Button with Solid Colors */}
              <div
                className='w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:shadow-xl'
                style={{
                  backgroundColor:
                    contact.type === 'phone' ||
                    contact.type === 'telephone' ||
                    contact.type === 'mobile'
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
