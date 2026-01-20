'use client';

import React, { useState } from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { useLanguage, useLocalizedText } from '@/providers/language-provider';
import { ContactModal } from '@/components/ui/contact-modal';

interface ProductInfoProps {
  product: {
    name: string;
    nameVi?: string | null;
    description: string | null;
    descriptionVi?: string | null;
    shortDescription: string | null;
    shortDescriptionVi?: string | null;
    basePrice: string;
    discountPrice?: string | null;
    showPrice?: boolean;
  };
  contacts: {
    type: string;
    label: string | null;
    labelVi?: string | null;
    value: string;
  }[];
}

export function ProductInfo({ product, contacts }: ProductInfoProps) {
  const { locale } = useLanguage();
  const t = useLocalizedText();
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const hasDiscount = !!product.discountPrice;
  const displayPrice = hasDiscount ? product.discountPrice : product.basePrice;
  const originalPrice = product.basePrice;
  const showPrice = product.showPrice ?? true;

  return (
    <>
      <div className='flex flex-col gap-8'>
        {/* Title & Short Description */}
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl md:text-5xl font-serif text-black uppercase tracking-wider'>
            {t(product, 'name')}
          </h1>
          {(() => {
            const shortDesc = t(product, 'shortDescription');
            return shortDesc ? (
              <div
                className='text-[14px] md:text-[16px] leading-relaxed text-gray-600 font-serif'
                dangerouslySetInnerHTML={{ __html: shortDesc }}
              />
            ) : null;
          })()}
        </div>

        {/* Price */}
        {showPrice && (
          <div className='flex items-center gap-4'>
            {hasDiscount ? (
              <>
                <span className='text-2xl md:text-3xl font-serif font-bold text-[#49000D]'>
                  ${displayPrice}
                </span>
                <span className='text-lg md:text-xl font-serif line-through text-gray-400'>
                  ${originalPrice}
                </span>
              </>
            ) : (
              <span className='text-2xl md:text-3xl font-serif text-black font-medium'>
                ${originalPrice}
              </span>
            )}
          </div>
        )}

        {/* Accordion */}
        <div className='border-t border-b border-gray-200 py-4'>
          <button
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className='flex items-center justify-between w-full group'
          >
            <span className='text-[13px] font-serif uppercase tracking-[0.2em] text-black/80 group-hover:text-black transition-colors'>
              {locale === 'vi' ? 'Thông tin sản phẩm' : 'Product Details'}
            </span>
            <div className='w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:border-black transition-all'>
              {isDetailsOpen ? <Minus size={14} /> : <Plus size={14} />}
            </div>
          </button>

          <div
            className={cn(
              'overflow-hidden transition-all duration-500 ease-in-out',
              isDetailsOpen ? 'max-h-[1000px] mt-6 opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            {(() => {
              const description = t(product, 'description');
              return description ? (
                <div
                  className='text-[13px] md:text-[14px] leading-relaxed text-gray-600 font-serif prose prose-sm max-w-none'
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p className='text-[13px] md:text-[14px] leading-relaxed text-gray-600 font-serif italic'>
                  {locale === 'vi'
                    ? 'Chưa có thông tin chi tiết cho sản phẩm này.'
                    : 'No detailed information available for this product.'}
                </p>
              );
            })()}
          </div>
        </div>

        {/* Contact Button - Opens Modal */}
        <button
          onClick={() => setIsContactModalOpen(true)}
          className='w-full bg-[#8B0000] hover:bg-[#A00000] text-white py-4 md:py-5 px-6 md:px-8 rounded-sm flex items-center justify-center gap-2 md:gap-3 transition-all duration-300 group shadow-lg shadow-red-900/10 hover:shadow-red-900/20'
        >
          <ShoppingBag
            size={18}
            className='md:w-5 md:h-5 group-hover:scale-110 transition-transform'
          />
          <span className='text-[13px] md:text-[15px] font-serif uppercase tracking-[0.15em] md:tracking-[0.2em] font-medium'>
            {locale === 'vi' ? 'Liên hệ ngay để được tư vấn' : 'Contact us for consultation'}
          </span>
        </button>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contacts={contacts}
        locale={locale}
      />
    </>
  );
}
