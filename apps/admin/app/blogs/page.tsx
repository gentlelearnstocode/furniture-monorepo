import { getPosts } from '@/lib/actions/blog';
import { Button } from '@repo/ui/ui/button';
import { Plus, MoreHorizontal, Search, Newspaper, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/ui/table';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Input } from '@repo/ui/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/ui/dropdown-menu';
import { Badge } from '@repo/ui/ui/badge';
import { DeleteBlogItem } from './components/delete-blog-item';

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  const allPosts = await getPosts();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <nav className='flex items-center text-sm text-gray-500 mb-1'>
            <Link href='/' className='hover:text-gray-900 transition-colors'>
              Dashboard
            </Link>
            <span className='mx-2'>/</span>
            <span className='font-medium text-gray-900'>Blogs</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Blogs</h1>
          <p className='text-base text-gray-500 mt-1'>Manage your blog posts and articles.</p>
        </div>
        <div className='flex gap-3'>
          <Link href='/blogs/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Blog Post
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <Card className='p-4 flex flex-col justify-between'>
          <span className='text-sm font-medium text-gray-500'>Total Posts</span>
          <span className='text-2xl font-bold'>{allPosts.length}</span>
        </Card>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Blog List</CardTitle>
              <CardDescription>View and manage your blog posts.</CardDescription>
            </div>
            <div className='relative w-64'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
              <Input placeholder='Search blogs...' className='pl-8' />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-gray-50/50'>
                <TableHead className='w-[100px]'>Featured Image</TableHead>
                <TableHead className='min-w-[200px]'>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='w-[100px] text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-48 text-center text-gray-500'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <Newspaper className='h-8 w-8 text-gray-300' />
                      <p>No posts found. Create your first one to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                allPosts.map((post) => (
                  <TableRow key={post.id} className='group'>
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
        </CardContent>
      </Card>
    </div>
  );
}

function BlogActions({
  post,
}: {
  post: NonNullable<Awaited<ReturnType<typeof getPosts>>>[number];
}) {
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
