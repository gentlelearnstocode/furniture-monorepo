'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'w-12 h-12 bg-[#F8F8F8] backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-white transition-all duration-300 shadow-2xl z-[60]',
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-10 opacity-0 pointer-events-none',
      )}
      aria-label='Scroll to top'
    >
      <ChevronUp size={24} strokeWidth={1.5} />
    </button>
  );
}
