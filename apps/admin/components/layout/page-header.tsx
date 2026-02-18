'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui/ui/breadcrumb';

interface BreadcrumbItemProps {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItemProps[];
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
      <div className='space-y-1.5'>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className='mb-1'>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>{title}</h1>
        {description && <p className='text-base text-gray-500'>{description}</p>}
      </div>
      {actions && <div className='flex gap-3'>{actions}</div>}
    </div>
  );
}
