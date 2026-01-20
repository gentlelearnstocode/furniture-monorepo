'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Phone, MessageCircle, X, Facebook, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: {
    type: string;
    label: string | null;
    labelVi?: string | null;
    value: string;
  }[];
  locale?: 'en' | 'vi';
}

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  phone: <Phone size={22} strokeWidth={1.5} />,
  zalo: <span className='text-sm font-bold tracking-tight'>Zalo</span>,
  facebook: <Facebook size={22} strokeWidth={1.5} />,
  messenger: <MessageSquare size={22} strokeWidth={1.5} />,
  email: <Mail size={22} strokeWidth={1.5} />,
  whatsapp: <MessageSquare size={22} strokeWidth={1.5} />,
};

const CONTACT_COLORS: Record<string, string> = {
  phone: '#C00000',
  zalo: '#0068FF',
  facebook: '#1877F2',
  messenger: '#00B2FF',
  email: '#EA4335',
  whatsapp: '#25D366',
};

const CONTACT_LABELS: Record<string, { en: string; vi: string }> = {
  phone: { en: 'Phone', vi: 'Điện thoại' },
  zalo: { en: 'Zalo', vi: 'Zalo' },
  facebook: { en: 'Facebook', vi: 'Facebook' },
  messenger: { en: 'Messenger', vi: 'Messenger' },
  email: { en: 'Email', vi: 'Email' },
  whatsapp: { en: 'WhatsApp', vi: 'WhatsApp' },
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

const formatContactValue = (type: string, value: string) => {
  if (type === 'phone') {
    return value;
  }
  if (type === 'email') {
    return value;
  }
  if (value.includes('facebook.com') || value.includes('fb.com')) {
    return 'Facebook Page';
  }
  if (value.includes('m.me')) {
    return 'Messenger';
  }
  return value.replace(/https?:\/\/(www\.)?/, '').slice(0, 30);
};

export function ContactModal({ isOpen, onClose, contacts, locale = 'vi' }: ContactModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center p-4',
        'transition-all duration-300 ease-out',
        isAnimating ? 'bg-black/60' : 'bg-transparent',
      )}
      onClick={handleBackdropClick}
    >
      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full max-w-sm mx-auto',
          'bg-white',
          'rounded-xl',
          'shadow-2xl',
          'transition-all duration-300 ease-out',
          'overflow-hidden',
          isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='px-6 py-5 border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>
              {locale === 'vi' ? 'Liên hệ với chúng tôi' : 'Contact Us'}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                'hover:bg-gray-100 text-gray-400 hover:text-gray-600',
                'transition-all duration-200',
              )}
              aria-label='Close'
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Contact List */}
        <div className='px-6 py-5 overflow-y-auto max-h-[55vh]'>
          <div className='space-y-2'>
            {contacts.map((contact, index) => {
              const defaultLabel = CONTACT_LABELS[contact.type] || {
                en: contact.type,
                vi: contact.type,
              };
              const displayLabel =
                locale === 'vi'
                  ? contact.labelVi || contact.label || defaultLabel.vi
                  : contact.label || defaultLabel.en;

              const isExternal = !['phone', 'email'].includes(contact.type);
              const bgColor = CONTACT_COLORS[contact.type] || '#444444';

              return (
                <a
                  key={index}
                  href={getContactHref(contact.type, contact.value)}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'group flex items-center gap-4 p-3 rounded-xl',
                    'bg-gray-50 hover:bg-gray-100',
                    'transition-all duration-200 ease-out',
                  )}
                >
                  {/* Icon with solid color */}
                  <div
                    className='w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md'
                    style={{ backgroundColor: bgColor }}
                  >
                    {CONTACT_ICONS[contact.type] || <MessageCircle size={22} />}
                  </div>

                  {/* Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='text-sm font-semibold text-gray-900 flex items-center gap-1.5'>
                      {displayLabel}
                      {isExternal && <ExternalLink size={12} className='text-gray-400' />}
                    </div>
                    <div className='text-xs text-gray-500 truncate mt-0.5'>
                      {formatContactValue(contact.type, contact.value)}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                      'bg-white text-gray-400',
                      'transition-all duration-200',
                      'group-hover:text-gray-600 group-hover:translate-x-0.5',
                    )}
                  >
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M9 18l6-6-6-6' />
                    </svg>
                  </div>
                </a>
              );
            })}

            {contacts.length === 0 && (
              <div className='text-center py-8 text-gray-500 text-sm'>
                {locale === 'vi' ? 'Chưa có thông tin liên hệ' : 'No contact information available'}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='px-6 py-4 border-t border-gray-100 bg-gray-50'>
          <p className='text-xs text-center text-gray-400'>
            {locale === 'vi'
              ? 'Chúng tôi sẽ phản hồi trong thời gian sớm nhất'
              : 'We will respond as soon as possible'}
          </p>
        </div>
      </div>
    </div>
  );
}
