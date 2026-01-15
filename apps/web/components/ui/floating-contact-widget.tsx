'use client';

import React, { useState } from 'react';
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
  phone: <Phone size={20} strokeWidth={1.5} />,
  zalo: <span className='text-[10px] font-bold tracking-tighter leading-none'>Zalo</span>,
  facebook: <Facebook size={20} strokeWidth={1.5} />,
  messenger: <MessageSquare size={20} strokeWidth={1.5} />,
  email: <Mail size={20} strokeWidth={1.5} />,
  whatsapp: <MessageSquare size={20} strokeWidth={1.5} />,
};

const CONTACT_COLORS: Record<string, string> = {
  phone: 'bg-[#C00000]',
  zalo: 'bg-[#0068FF]',
  facebook: 'bg-[#1877F2]',
  messenger: 'bg-[#00B2FF]',
  email: 'bg-[#EA4335]',
  whatsapp: 'bg-[#25D366]',
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
  const activeContacts = contacts.filter((c) => c.isActive);

  if (activeContacts.length === 0) return null;

  return (
    <div className='flex flex-col items-center gap-4'>
      {/* Expanded Menu */}
      <div
        className={cn(
          'flex flex-col items-center gap-3 transition-all duration-300 origin-bottom',
          isOpen
            ? 'scale-100 opacity-100 transform translate-y-0'
            : 'scale-0 opacity-0 transform translate-y-10'
        )}
      >
        {activeContacts.map((contact, index) => (
          <a
            key={index}
            href={getContactHref(contact.type, contact.value)}
            target={contact.type === 'phone' || contact.type === 'email' ? undefined : '_blank'}
            rel={
              contact.type === 'phone' || contact.type === 'email'
                ? undefined
                : 'noopener noreferrer'
            }
            className='group flex items-center gap-3'
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span className='bg-black/95 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-2xl text-[11px] font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap order-first border border-white/10'>
              {contact.label || contact.type}
            </span>
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all duration-300 ring-4 ring-transparent hover:ring-white/20 border border-white/20',
                CONTACT_COLORS[contact.type] || 'bg-gray-800'
              )}
            >
              {CONTACT_ICONS[contact.type] || <MessageCircle size={20} />}
            </div>
          </a>
        ))}
      </div>

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 relative ring-4 border border-white/20',
          isOpen
            ? 'bg-black ring-black/10 rotate-[360deg]'
            : 'bg-[#7B0C0C] ring-[#7B0C0C]/10 hover:scale-105 hover:bg-[#900000]'
        )}
      >
        {isOpen ? (
          <X size={24} className='animate-in fade-in zoom-in duration-300' />
        ) : (
          <MessageCircle size={28} className='animate-pulse' />
        )}

        {/* Subtle status indicator */}
        {!isOpen && (
          <span className='absolute -top-1 -right-1 flex h-4 w-4'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-sm'></span>
          </span>
        )}
      </button>
    </div>
  );
}
