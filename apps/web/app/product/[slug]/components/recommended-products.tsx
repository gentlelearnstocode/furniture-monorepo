'use client';

import { ProductCard } from '@/app/components/product-card';
import { useLanguage } from '@/providers/language-provider';
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
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  const { locale } = useLanguage();

  if (!products || products.length === 0) {
    return null;
  }

  const title = locale === 'vi' ? 'Sản phẩm gợi ý' : 'You May Also Like';

  return (
    <section className='py-12 md:py-16'>
      <div className='container mx-auto px-4'>
        <h2 className='text-2xl md:text-3xl font-semibold text-center mb-8'>{title}</h2>

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
                  <ProductCard
                    product={product}
                    className='animate-in fade-in slide-in-from-bottom-4 duration-700'
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='-left-2 md:-left-6 top-[38%] md:top-[40%] z-20' />
            <CarouselNext className='-right-2 md:-right-6 top-[38%] md:top-[40%] z-20' />
            {products.length > 4 && <CarouselDots className='mt-8' />}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
