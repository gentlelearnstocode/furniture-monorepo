'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/app/components/product-card';
import { useTranslations } from 'next-intl';
import { useLocalizedText } from '@/providers/language-provider';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@repo/ui/ui/carousel';

interface SaleSectionProps {
  products: any[];
  settings: any;
}

export const SaleSection = ({ products, settings }: SaleSectionProps) => {
  const t = useTranslations('SaleSection');
  const tl = useLocalizedText();

  if (!settings || !settings.isActive || products.length === 0) {
    return null;
  }

  return (
    <section className='bg-white py-16 md:py-20'>
      <div className='container'>
        {/* Section Header */}
        <div className='flex flex-col items-center mb-12'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-serif text-[#49000D] tracking-wide uppercase'>
            {tl(settings, 'title') || t('title')}
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

        {/* Product Carousel */}
        <div className='relative px-4 md:px-12'>
          <Carousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-4'>
              {products.map((product) => (
                <CarouselItem key={product.id} className='pl-4 basis-1/2 lg:basis-1/4'>
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='-left-3 md:-left-6 top-[38%] md:top-[40%] z-20' />
            <CarouselNext className='-right-3 md:-right-6 top-[38%] md:top-[40%] z-20' />
            <CarouselDots className='mt-10' />
          </Carousel>
        </div>

        {/* Expand Your View Link */}
        <div className='flex justify-center mt-10'>
          <Link
            href='/sale'
            className='group flex items-center gap-2 text-[13px] font-medium tracking-wider text-gray-700 hover:text-[#49000D] transition-colors'
          >
            <span>{t('expandYourView')}</span>
            <div className='w-5 h-5 rounded-full border border-current flex items-center justify-center transition-transform group-hover:translate-x-1'>
              <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
