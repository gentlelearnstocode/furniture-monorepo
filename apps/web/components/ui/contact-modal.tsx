'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X, Facebook, Mail, MessageSquare, ExternalLink } from 'lucide-react';
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

const TelephoneIcon = ({ size = 22 }: { size?: number }) => (
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
  phone: <TelephoneIcon size={22} />,
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
