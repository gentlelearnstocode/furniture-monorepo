'use client';

import React, { useState } from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';

interface ProductInfoProps {
  product: {
    name: string;
    description: string | null;
    shortDescription: string | null;
    basePrice: string;
    discountPrice?: string | null;
    showPrice?: boolean;
  };
  contacts: {
    type: string;
    label: string | null;
    value: string;
  }[];
}

export function ProductInfo({ product, contacts }: ProductInfoProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  const hasDiscount = !!product.discountPrice;
  const displayPrice = hasDiscount ? product.discountPrice : product.basePrice;
  const originalPrice = product.basePrice;
  const showPrice = product.showPrice ?? true;

  const handleContact = () => {
    // console.log('[ProductInfo] Contacts:', contacts);
    const zaloContact = contacts.find((c) => c.type === 'zalo');
    const phoneContact = contacts.find((c) => c.type === 'phone');

    if (zaloContact) {
      const cleanValue = zaloContact.value.replace(/\s/g, '');
      window.open(`https://zalo.me/${cleanValue}`, '_blank');
      return;
    }

    if (phoneContact) {
      const cleanValue = phoneContact.value.replace(/\s/g, '');
      window.location.href = `tel:${cleanValue}`;
      return;
    }

    // Fallback to any active contact if neither Zalo nor Phone is found
    if (contacts.length > 0) {
      const firstContact = contacts[0];
      if (firstContact) {
        let href = firstContact.value;
        if (!href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
          href = `https://${href}`;
        }
        window.open(href, '_blank');
      }
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      {/* Title & Short Description */}
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl md:text-5xl font-serif text-black uppercase tracking-wider'>
          {product.name}
        </h1>
        {product.shortDescription && (
          <div
            className='text-[16px] leading-relaxed text-gray-600 font-serif'
            dangerouslySetInnerHTML={{ __html: product.shortDescription }}
          />
        )}
      </div>

      {/* Price */}
      {showPrice && (
        <div className='flex items-center gap-4'>
          {hasDiscount ? (
            <>
              <span className='text-3xl font-serif font-bold text-[#49000D]'>${displayPrice}</span>
              <span className='text-xl font-serif line-through text-gray-400'>
                ${originalPrice}
              </span>
            </>
          ) : (
            <span className='text-3xl font-serif text-black font-medium'>${originalPrice}</span>
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
            Product Details
          </span>
          <div className='w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:border-black transition-all'>
            {isDetailsOpen ? <Minus size={14} /> : <Plus size={14} />}
          </div>
        </button>

        <div
          className={cn(
            'overflow-hidden transition-all duration-500 ease-in-out',
            isDetailsOpen ? 'max-h-[1000px] mt-6 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          {product.description ? (
            <div
              className='text-[14px] leading-relaxed text-gray-600 font-serif prose prose-sm max-w-none'
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className='text-[14px] leading-relaxed text-gray-600 font-serif italic'>
              No detailed information available for this product.
            </p>
          )}
        </div>
      </div>

      {/* Contact Button */}
      <button
        onClick={handleContact}
        className='w-full bg-[#8B0000] hover:bg-[#A00000] text-white py-5 px-8 rounded-sm flex items-center justify-center gap-3 transition-all duration-300 group shadow-lg shadow-red-900/10 hover:shadow-red-900/20'
      >
        <ShoppingBag size={20} className='group-hover:scale-110 transition-transform' />
        <span className='text-[15px] font-serif uppercase tracking-[0.2em] font-medium'>
          Liên hệ ngay để được tư vấn
        </span>
      </button>
    </div>
  );
}
