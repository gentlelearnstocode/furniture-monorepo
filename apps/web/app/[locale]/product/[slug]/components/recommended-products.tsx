'use client';

import { ProductCard } from '@/app/[locale]/components/product-card';
import { useTranslations } from 'next-intl';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@repo/ui/ui/carousel';

interface RecommendedProductsProps {
  products: any[];
  imageRatio?: string | null;
}

export function RecommendedProducts({ products, imageRatio }: RecommendedProductsProps) {
  const t = useTranslations('Product');

  if (!products || products.length === 0) {
    return null;
  }

  const title = t('youMayAlsoLike');

  return (
    <section className='pt-12 pb-16 md:pt-16 md:pb-24 border-t border-black/5'>
      <div className='container'>
        <h2 className='text-[26px] md:text-[32px] font-serif font-medium text-center mb-12 text-black'>
          {title}
        </h2>

        <div className='relative px-0 md:px-12'>
          <Carousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-4'>
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className='pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/4'
                >
                  <ProductCard product={product} imageRatio={imageRatio} className='h-full' />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='hidden md:flex -left-6 top-[40%] z-20 h-10 w-10 border-black/10 hover:bg-black hover:text-white transition-colors' />
            <CarouselNext className='hidden md:flex -right-6 top-[40%] z-20 h-10 w-10 border-black/10 hover:bg-black hover:text-white transition-colors' />
            {products.length > 4 && <CarouselDots className='mt-10' />}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
