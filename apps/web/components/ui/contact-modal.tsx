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
  phone: <Phone size={24} strokeWidth={1.5} />,
  zalo: <span className='text-sm font-bold tracking-tight'>Zalo</span>,
  facebook: <Facebook size={24} strokeWidth={1.5} />,
  messenger: <MessageSquare size={24} strokeWidth={1.5} />,
  email: <Mail size={24} strokeWidth={1.5} />,
  whatsapp: <MessageSquare size={24} strokeWidth={1.5} />,
};

const CONTACT_CONFIG: Record<
  string,
  { gradient: string; glow: string; label: { en: string; vi: string } }
> = {
  phone: {
    gradient: 'from-rose-600 to-red-700',
    glow: 'group-hover:shadow-rose-500/30',
    label: { en: 'Phone', vi: 'Điện thoại' },
  },
  zalo: {
    gradient: 'from-blue-500 to-blue-600',
    glow: 'group-hover:shadow-blue-500/30',
    label: { en: 'Zalo', vi: 'Zalo' },
  },
  facebook: {
    gradient: 'from-blue-600 to-indigo-700',
    glow: 'group-hover:shadow-blue-600/30',
    label: { en: 'Facebook', vi: 'Facebook' },
  },
  messenger: {
    gradient: 'from-sky-400 to-blue-500',
    glow: 'group-hover:shadow-sky-500/30',
    label: { en: 'Messenger', vi: 'Messenger' },
  },
  email: {
    gradient: 'from-orange-500 to-red-500',
    glow: 'group-hover:shadow-orange-500/30',
    label: { en: 'Email', vi: 'Email' },
  },
  whatsapp: {
    gradient: 'from-emerald-500 to-green-600',
    glow: 'group-hover:shadow-emerald-500/30',
    label: { en: 'WhatsApp', vi: 'WhatsApp' },
  },
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
    // Format phone for display
    return value;
  }
  if (type === 'email') {
    return value;
  }
  // For social media, just show a shorter version
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
        'fixed inset-0 z-50 flex items-end md:items-center justify-center',
        'transition-all duration-300 ease-out',
        isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent',
      )}
      onClick={handleBackdropClick}
    >
      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full md:max-w-md',
          'bg-white/95 backdrop-blur-xl',
          'rounded-t-3xl md:rounded-2xl',
          'shadow-2xl shadow-black/20',
          'transition-all duration-300 ease-out',
          'max-h-[85vh] overflow-hidden',
          isAnimating
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-full md:translate-y-4 opacity-0 md:scale-95',
        )}
      >
        {/* Handle bar for mobile */}
        <div className='md:hidden flex justify-center pt-3 pb-1'>
          <div className='w-10 h-1 rounded-full bg-gray-300' />
        </div>

        {/* Header */}
        <div className='px-6 py-4 border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-serif font-semibold text-gray-900'>
                {locale === 'vi' ? 'Liên hệ với chúng tôi' : 'Contact Us'}
              </h2>
              <p className='text-sm text-gray-500 mt-0.5'>
                {locale === 'vi'
                  ? 'Chọn phương thức liên hệ phù hợp với bạn'
                  : 'Choose your preferred contact method'}
              </p>
            </div>
            <button
              onClick={onClose}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700',
                'transition-all duration-200',
              )}
              aria-label='Close'
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contact Cards */}
        <div className='px-6 py-5 overflow-y-auto max-h-[60vh] space-y-3'>
          {contacts.map((contact, index) => {
            const config = CONTACT_CONFIG[contact.type] || {
              gradient: 'from-gray-600 to-gray-700',
              glow: 'group-hover:shadow-gray-500/30',
              label: { en: contact.type, vi: contact.type },
            };

            const displayLabel =
              locale === 'vi'
                ? contact.labelVi || contact.label || config.label.vi
                : contact.label || config.label.en;

            const isExternal = !['phone', 'email'].includes(contact.type);

            return (
              <a
                key={index}
                href={getContactHref(contact.type, contact.value)}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={cn(
                  'group flex items-center gap-4 p-4 rounded-xl',
                  'bg-gradient-to-br from-gray-50 to-white',
                  'border border-gray-100 hover:border-gray-200',
                  'shadow-sm hover:shadow-lg',
                  'transition-all duration-300 ease-out',
                  'hover:-translate-y-0.5',
                  config.glow,
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center text-white',
                    'bg-gradient-to-br shadow-lg',
                    'transition-all duration-300',
                    'group-hover:scale-105 group-hover:shadow-xl',
                    config.gradient,
                  )}
                >
                  {CONTACT_ICONS[contact.type] || <MessageCircle size={24} />}
                </div>

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <div className='text-sm font-semibold text-gray-900 flex items-center gap-2'>
                    {displayLabel}
                    {isExternal && (
                      <ExternalLink
                        size={14}
                        className='text-gray-400 group-hover:text-gray-600 transition-colors'
                      />
                    )}
                  </div>
                  <div className='text-sm text-gray-500 truncate mt-0.5'>
                    {formatContactValue(contact.type, contact.value)}
                  </div>
                </div>

                {/* Arrow */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    'bg-gray-100 group-hover:bg-gray-200',
                    'text-gray-400 group-hover:text-gray-600',
                    'transition-all duration-300',
                    'group-hover:translate-x-1',
                  )}
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M5 12h14M12 5l7 7-7 7' />
                  </svg>
                </div>
              </a>
            );
          })}

          {contacts.length === 0 && (
            <div className='text-center py-8 text-gray-500'>
              {locale === 'vi' ? 'Chưa có thông tin liên hệ' : 'No contact information available'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='px-6 py-4 border-t border-gray-100 bg-gray-50/50'>
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
