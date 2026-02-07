import { LucideIcon } from 'lucide-react';

interface ProcessCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ProcessCard({ icon: Icon, title, description }: ProcessCardProps) {
  return (
    <div className='flex flex-col items-center p-8 bg-white rounded-xl border border-brand-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full text-center'>
      <div className='bg-brand-neutral-50 p-4 rounded-full mb-6 group-hover:bg-brand-primary-50 transition-colors duration-300'>
        <Icon className='w-8 h-8 text-brand-neutral-700 transition-colors duration-300' />
      </div>
      <h3 className='text-xl font-serif font-bold text-brand-neutral-900 mb-4 uppercase tracking-wide'>
        {title}
      </h3>
      <p className='text-brand-neutral-600 leading-relaxed text-sm md:text-base'>{description}</p>
    </div>
  );
}
