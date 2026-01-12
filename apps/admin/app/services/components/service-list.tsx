'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/ui/table';
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Badge } from '@repo/ui/ui/badge';
import Image from 'next/image';
import { Briefcase, MoreHorizontal, Pencil } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { BulkActions } from '@/components/ui/bulk-actions';
import { bulkDeleteServices } from '@/lib/actions/service';
import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/ui/dropdown-menu';
import { DeleteServiceItem } from './delete-service-item';

interface ServiceListProps {
  services: any[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export function ServiceList({ services, meta }: ServiceListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === services.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(services.map((s) => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <>
      <div className='relative overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-gray-50/50'>
              <TableHead className='w-[40px]'>
                <Checkbox
                  checked={selectedIds.length === services.length && services.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className='w-[100px]'>Image</TableHead>
              <TableHead className='min-w-[200px]'>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[100px] text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-48 text-center text-gray-500'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <Briefcase className='h-8 w-8 text-gray-300' />
                    <p>No services found matched your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id} className='group'>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(service.id)}
                      onCheckedChange={() => toggleSelect(service.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='relative h-12 w-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200'>
                      {service.image && service.image.url ? (
                        <Image
                          src={service.image.url}
                          alt={service.title}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='flex items-center justify-center h-full w-full'>
                          <Briefcase className='h-4 w-4 text-gray-400' />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='font-medium text-gray-900'>{service.title}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary' className='font-normal font-mono text-xs'>
                      {service.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={service.isActive ? 'default' : 'secondary'}
                      className={
                        service.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <ServiceActions service={service} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination currentPage={meta.currentPage} totalPages={meta.totalPages} />

      <BulkActions
        selectedIds={selectedIds}
        onClear={() => setSelectedIds([])}
        onDelete={bulkDeleteServices}
        resourceName='Service'
      />
    </>
  );
}

function ServiceActions({ service }: { service: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/services/${service.id}`} className='cursor-pointer'>
            <Pencil className='mr-2 h-4 w-4' />
            Edit Service
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteServiceItem id={service.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
