import Image from 'next/image';
import styles from './running-banner.module.css';
import { cn } from '@/lib/utils';

export function RunningBanner() {
  const content = (
    <div className='relative h-[50px] w-[340px] mx-8'>
      <Image
        src='/brand-text.png'
        alt='THIÊN ẤN Furniture SINCE 1997'
        fill
        className='object-contain'
      />
    </div>
  );

  return (
    <div className='relative h-[140px] w-full overflow-hidden bg-[#333333]'>
      {/* Background Gradient */}
      <div
        className='absolute inset-0 z-0'
        style={{
          background:
            'radial-gradient(50% 8625% at 50% 50%, #B80022 0%, #970D26 25%, #761A2B 50%, #54262F 75%, #333333 100%)',
        }}
      />

      {/* Background Pattern */}
      <div className='absolute inset-0 z-10 opacity-25 mix-blend-overlay'>
        <Image src='/nav-bg.png' alt='' fill className='object-cover' />
      </div>
      <div className='absolute inset-0 z-10 bg-[rgba(34,34,34,0.25)]' />

      {/* Marquee Content */}
      <div className='relative z-20 flex h-full items-center overflow-hidden'>
        <div className={cn('flex', styles.scrollerInner)}>
          {content}
          {content}
          {content}
          {content}
          {content}
          {content}
        </div>
      </div>
    </div>
  );
}
