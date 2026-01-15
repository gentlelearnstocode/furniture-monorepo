'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';

interface ContactButtonProps {
  contacts: {
    type: string;
    value: string;
  }[];
  className?: string;
  label?: string;
}

export function ContactButton({
  contacts,
  className,
  label = 'Liên hệ tư vấn',
}: ContactButtonProps) {
  const zaloContact = contacts.find((c) => c.type === 'zalo');
  const phoneContact = contacts.find((c) => c.type === 'phone');

  const contactValue = zaloContact?.value || phoneContact?.value;
  const cleanValue = contactValue?.replace(/\s/g, '');

  const handleContact = () => {
    if (zaloContact) {
      const cleanValue = zaloContact.value.replace(/\s/g, '');
      window.open(`https://zalo.me/${cleanValue}`, '_blank');
    } else if (phoneContact) {
      const cleanValue = phoneContact.value.replace(/\s/g, '');
      window.location.href = `tel:${cleanValue}`;
    }
  };

  if (!zaloContact && !phoneContact && contacts.length === 0) return null;

  return (
    <button
      onClick={handleContact}
      className={cn(
        'group flex items-center justify-center gap-3 bg-[#7B0C0C] hover:bg-[#5a0909] text-white py-4 px-8 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl',
        className
      )}
    >
      <MessageCircle size={20} className='group-hover:scale-110 transition-transform' />
      <span className='font-serif uppercase tracking-widest text-sm font-medium'>{label}</span>
    </button>
  );
}
