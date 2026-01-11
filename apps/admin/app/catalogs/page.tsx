import { db } from '@repo/database';
import { Button } from '@repo/ui/ui/button';
import { Plus, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Input } from '@repo/ui/ui/input';
import { Badge } from '@repo/ui/ui/badge';

import { CatalogActions } from './components/catalog-actions';

export const dynamic = 'force-dynamic';

export default async function CatalogsPage() {
  const allCatalogs = await db.query.catalogs.findMany({
    orderBy: (catalogs, { desc }) => [desc(catalogs.createdAt)],
    with: {
      parent: true,
      image: true,
    },
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <nav className='flex items-center text-sm text-gray-500 mb-1'>
            <Link href='/' className='hover:text-gray-900 transition-colors'>
              Dashboard
            </Link>
            <span className='mx-2'>/</span>
            <span className='font-medium text-gray-900'>Catalogs</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Catalogs</h1>
          <p className='text-base text-gray-500 mt-1'>
            Manage product categories and organizational hierarchy.
          </p>
        </div>
        <div className='flex gap-3'>
          <Link href='/catalogs/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Catalog
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <Card className='p-4 flex flex-col justify-between'>
          <span className='text-sm font-medium text-gray-500'>Total Catalogs</span>
          <span className='text-2xl font-bold'>{allCatalogs.length}</span>
        </Card>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Catalog List</CardTitle>
              <CardDescription>View and manage your catalogs.</CardDescription>
            </div>
            <div className='relative w-64'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
              <Input placeholder='Search catalogs...' className='pl-8' />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-gray-50/50'>
                <TableHead className='w-[80px]'>Image</TableHead>
                <TableHead className='w-[300px]'>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className='hidden md:table-cell'>Description</TableHead>
                <TableHead className='w-[100px] text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCatalogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className='h-48 text-center text-gray-500'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <Settings className='h-8 w-8 text-gray-300' />
                      <p>No catalogs found. Create your first one to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                allCatalogs.map((catalog) => (
                  <TableRow key={catalog.id} className='group'>
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
                    <TableCell className='hidden md:table-cell text-gray-500 max-w-xs truncate'>
                      {catalog.description || (
                        <span className='text-gray-300 italic'>No description</span>
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
        </CardContent>
      </Card>
    </div>
  );
}
