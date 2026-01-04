import { db } from '@repo/database';
import { Layers, Search } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/ui/table';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Input } from '@repo/ui/ui/input';
import { Badge } from '@repo/ui/ui/badge';
import { HomeVisibilityToggle } from './components/home-visibility-toggle';

export const dynamic = 'force-dynamic';

export default async function HomepageCollectionsPage() {
  const allCollections = await db.query.collections.findMany({
    with: {
      banner: true,
    },
    orderBy: (collections, { desc }) => [desc(collections.createdAt)],
  });

  return (
    <div className='space-y-6'>
      <div>
        <nav className='flex items-center text-sm text-gray-500 mb-1'>
          <Link href='/' className='hover:text-gray-900 transition-colors'>
            Dashboard
          </Link>
          <span className='mx-2'>/</span>
          <Link href='/homepage' className='hover:text-gray-900 transition-colors'>
            Homepage
          </Link>
          <span className='mx-2'>/</span>
          <span className='font-medium text-gray-900'>Collection Section</span>
        </nav>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Homepage Collections</h1>
        <p className='text-base text-gray-500 mt-1'>
          Select which collections to feature on the home page.
        </p>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Collections Visibility</CardTitle>
              <CardDescription>Toggle collections for the home page section.</CardDescription>
            </div>
            <div className='relative w-64'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
              <Input placeholder='Search collections...' className='pl-8' />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-gray-50/50'>
                <TableHead className='w-[80px]'>Banner</TableHead>
                <TableHead className='min-w-[200px]'>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-center'>Show on Home</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCollections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className='h-48 text-center text-gray-500'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <Layers className='h-8 w-8 text-gray-300' />
                      <p>No collections found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                allCollections.map((collection) => (
                  <TableRow key={collection.id} className='group'>
                    <TableCell>
                      <div className='relative h-10 w-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200'>
                        {collection.banner?.url ? (
                          <Image
                            src={collection.banner.url}
                            alt={collection.name}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='flex items-center justify-center h-full w-full'>
                            <Layers className='h-3 w-3 text-gray-400' />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col'>
                        <span className='font-medium text-gray-900'>{collection.name}</span>
                        <span className='text-xs text-gray-500 truncate max-w-[200px]'>
                          {collection.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={collection.isActive ? 'success' : ('secondary' as any)}
                        className='font-medium text-[10px] uppercase tracking-wider'
                      >
                        {collection.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex justify-center'>
                        <HomeVisibilityToggle
                          id={collection.id}
                          initialValue={collection.showOnHome}
                        />
                      </div>
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
