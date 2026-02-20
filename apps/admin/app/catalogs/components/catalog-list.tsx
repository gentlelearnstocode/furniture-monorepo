'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/ui/table';
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Badge } from '@repo/ui/ui/badge';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { BulkActions } from '@/components/ui/bulk-actions';
import { bulkDeleteCatalogs } from '@/lib/actions/catalogs';
import { CatalogActions } from './catalog-actions';
import { type Catalog } from '@repo/shared';

interface CatalogListProps {
  catalogs: Catalog[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export function CatalogList({ catalogs, meta }: CatalogListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === catalogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(catalogs.map((c) => c.id));
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
                  checked={selectedIds.length === catalogs.length && catalogs.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className='w-[80px]'>Image</TableHead>
              <TableHead className='w-[300px]'>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className='w-[100px] text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {catalogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-48 text-center text-gray-500'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <Settings className='h-8 w-8 text-gray-300' />
                    <p>No catalogs found matched your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              catalogs.map((catalog) => (
                <TableRow key={catalog.id} className='group'>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(catalog.id)}
                      onCheckedChange={() => toggleSelect(catalog.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {catalog.image ? (
                      <div className='relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 border'>
                        <Image
                          src={catalog.image.url}
                          alt={catalog.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                    ) : (
                      <div className='h-10 w-10 rounded-md bg-gray-50 border border-dashed flex items-center justify-center'>
                        <Settings className='h-4 w-4 text-gray-300' />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='font-medium text-gray-900'>{catalog.name}</span>
                      <div className='md:hidden text-xs text-gray-500 truncate max-w-[150px]'>
                        {catalog.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary' className='font-normal font-mono text-xs'>
                      {catalog.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {catalog.parentId ? (
                      <div className='flex flex-col gap-1'>
                        <Badge
                          variant='outline'
                          className='w-fit bg-blue-50 text-blue-700 border-blue-200'
                        >
                          Level 2
                        </Badge>
                        <span className='text-[10px] text-gray-400'>
                          Under: {catalog.parent?.name}
                        </span>
                      </div>
                    ) : (
                      <Badge
                        variant='outline'
                        className='bg-purple-50 text-purple-700 border-purple-200 uppercase tracking-wider text-[10px] font-bold'
                      >
                        Level 1
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {catalog.createdBy ? (
                      <span className='text-sm text-gray-600'>
                        {catalog.createdBy.name || catalog.createdBy.email}
                      </span>
                    ) : (
                      <span className='text-gray-400 text-xs'>-</span>
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    <CatalogActions id={catalog.id} name={catalog.name} />
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
        onDelete={bulkDeleteCatalogs}
        resourceName='Catalog'
      />
    </>
  );
}
