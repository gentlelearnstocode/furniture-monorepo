'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs?: Breadcrumb[];
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * Reusable page header component with breadcrumbs
 * Used across all admin listing and detail pages
 */
export function PageHeader({ breadcrumbs, title, description, actions }: PageHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className='flex items-center text-sm text-gray-500 mb-1'>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className='flex items-center'>
                {crumb.href ? (
                  <Link href={crumb.href} className='hover:text-gray-900 transition-colors'>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className='font-medium text-gray-900'>{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span className='mx-2'>/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>{title}</h1>
        {description && <p className='text-base text-gray-500 mt-1'>{description}</p>}
      </div>
      {actions && <div className='flex gap-3'>{actions}</div>}
    </div>
  );
}
