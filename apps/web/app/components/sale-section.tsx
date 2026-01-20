'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/app/components/product-card';
import { useLanguage, useLocalizedText } from '@/providers/language-provider';

interface SaleSectionProps {
  products: any[];
  settings: any;
}

export const SaleSection = ({ products, settings }: SaleSectionProps) => {
  const { locale } = useLanguage();
  const t = useLocalizedText();

  if (!settings || !settings.isActive || products.length === 0) {
    return null;
  }

  return (
    <section className='bg-white py-16 md:py-20'>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='flex flex-col items-center mb-12'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-serif text-[#49000D] tracking-wide uppercase'>
            {t(settings, 'title') || 'Sales'}
          </h2>

          {/* Decorative divider with icon */}
          <div className='flex items-center gap-3 mt-4'>
            <div className='w-16 h-[2px] bg-[#8B0000]' />
            <Image
              src='/symbol.svg'
              alt='decorative symbol'
              width={24}
              height={24}
              className='opacity-80'
            />
            <div className='w-16 h-[2px] bg-[#8B0000]' />
          </div>
        </div>

        {/* Product Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className='animate-in fade-in slide-in-from-bottom-4 duration-700'
            />
          ))}
        </div>

        {/* Expand Your View Link */}
        <div className='flex justify-center mt-10'>
          <Link
            href='/sale'
            className='group flex items-center gap-2 text-[13px] font-medium tracking-wider text-gray-700 hover:text-[#49000D] transition-colors'
          >
            <span>{locale === 'vi' ? 'Xem Thêm Sản Phẩm Khuyến Mãi' : 'Expand Your View'}</span>
            <div className='w-5 h-5 rounded-full border border-current flex items-center justify-center transition-transform group-hover:translate-x-1'>
              <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
