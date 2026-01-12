'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/ui/table';
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Badge } from '@repo/ui/ui/badge';
import Image from 'next/image';
import { Pagination } from '@/components/ui/pagination';
import { BulkActions } from '@/components/ui/bulk-actions';
import { bulkDeletePosts } from '@/lib/actions/blog';
import { Newspaper, MoreHorizontal, Pencil } from 'lucide-react';
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
import { DeleteBlogItem } from './delete-blog-item';

interface BlogListProps {
  posts: any[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export function BlogList({ posts, meta }: BlogListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === posts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(posts.map((p) => p.id));
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
                  checked={selectedIds.length === posts.length && posts.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className='w-[100px]'>Featured Image</TableHead>
              <TableHead className='min-w-[200px]'>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[100px] text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-48 text-center text-gray-500'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <Newspaper className='h-8 w-8 text-gray-300' />
                    <p>No posts found matched your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className='group'>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(post.id)}
                      onCheckedChange={() => toggleSelect(post.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='relative h-12 w-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200'>
                      {post.featuredImage && post.featuredImage.url ? (
                        <Image
                          src={post.featuredImage.url}
                          alt={post.title}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='flex items-center justify-center h-full w-full'>
                          <Newspaper className='h-4 w-4 text-gray-400' />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='font-medium text-gray-900'>{post.title}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary' className='font-normal font-mono text-xs'>
                      {post.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.isActive ? 'default' : 'secondary'}
                      className='font-medium text-[10px] uppercase tracking-wider'
                    >
                      {post.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <BlogActions post={post} />
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
        onDelete={bulkDeletePosts}
        resourceName='Blog Post'
      />
    </>
  );
}

function BlogActions({ post }: { post: any }) {
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
          <Link href={`/blogs/${post.id}`} className='cursor-pointer'>
            <Pencil className='mr-2 h-4 w-4' />
            Edit Post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteBlogItem id={post.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
