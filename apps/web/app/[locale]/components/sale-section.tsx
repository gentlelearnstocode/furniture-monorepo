'use client';

import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { BrandDivider } from './brand-divider';
import { ProductCard } from '@/app/[locale]/components/product-card';
import { useTranslations } from 'next-intl';
import { useLocalizedText } from '@/providers/language-provider';
import { type Product, type SaleSectionSettings } from '@repo/shared';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@repo/ui/ui/carousel';

interface SaleSectionProps {
  products: Product[];
  settings: SaleSectionSettings;
}

export const SaleSection = ({ products, settings }: SaleSectionProps) => {
  const t = useTranslations('SaleSection');
  const tl = useLocalizedText();

  if (!settings || !settings.isActive || products.length === 0) {
    return null;
  }

  return (
    <section className='bg-white py-12 md:py-16'>
      <div className='container'>
        {/* Section Header */}
        <div className='flex flex-col items-center mb-8'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-serif text-brand-primary-900 tracking-wide uppercase'>
            {tl(settings, 'title') || t('title')}
          </h2>

          <BrandDivider />
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
            className='group flex items-center gap-2 text-[13px] font-medium tracking-wider text-gray-700 hover:text-brand-primary-900 transition-colors'
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
