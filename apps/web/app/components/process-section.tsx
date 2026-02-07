import { getTranslations } from 'next-intl/server';
import { ProcessCard } from './process-card';
import { Search, MessageCircle, PenTool, Wrench, Star } from 'lucide-react';

export async function ProcessSection() {
  const t = await getTranslations('Process');
  const tCommon = await getTranslations('Common');

  const steps = [
    {
      icon: Search,
      title: t('step1.title'),
      description: t('step1.description'),
    },
    {
      icon: MessageCircle,
      title: t('step2.title'),
      description: t('step2.description'),
    },
    {
      icon: PenTool,
      title: t('step3.title'),
      description: t('step3.description'),
    },
    {
      icon: Wrench,
      title: t('step4.title'),
      description: t('step4.description'),
    },
    {
      icon: Star,
      title: t('step5.title'),
      description: t('step5.description'),
    },
  ];

  return (
    <section className='py-10 bg-white'>
      <div className='container mx-auto px-2 md:px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-serif font-bold text-brand-neutral-900 uppercase tracking-widest'>
            {t('title')} <span className='text-[#B80022]'>{tCommon('brandName')}</span>
          </h2>
        </div>

        <div className='max-w-7xl mx-auto'>
          {/* First row: 3 cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
            {steps.slice(0, 3).map((step, index) => (
              <ProcessCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>

          {/* Second row: 2 cards centered */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
            {steps.slice(3).map((step, index) => (
              <ProcessCard
                key={index + 3}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
