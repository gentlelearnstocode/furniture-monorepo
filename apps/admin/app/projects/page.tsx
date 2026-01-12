import { getProjects } from '@/lib/actions/project';
import { Button } from '@repo/ui/ui/button';
import { Plus, MoreHorizontal, Search, DraftingCompass, Pencil } from 'lucide-react';
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
import { DeleteProjectItem } from './components/delete-project-item';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const allProjects = await getProjects();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <nav className='flex items-center text-sm text-gray-500 mb-1'>
            <Link href='/' className='hover:text-gray-900 transition-colors'>
              Dashboard
            </Link>
            <span className='mx-2'>/</span>
            <span className='font-medium text-gray-900'>Projects</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Projects</h1>
          <p className='text-base text-gray-500 mt-1'>Manage your project showcases.</p>
        </div>
        <div className='flex gap-3'>
          <Link href='/projects/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <Card className='p-4 flex flex-col justify-between'>
          <span className='text-sm font-medium text-gray-500'>Total Projects</span>
          <span className='text-2xl font-bold'>{allProjects.length}</span>
        </Card>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Project List</CardTitle>
              <CardDescription>View and manage your projects.</CardDescription>
            </div>
            <div className='relative w-64'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
              <Input placeholder='Search projects...' className='pl-8' />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-gray-50/50'>
                <TableHead className='w-[100px]'>Image</TableHead>
                <TableHead className='min-w-[200px]'>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='w-[100px] text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-48 text-center text-gray-500'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <DraftingCompass className='h-8 w-8 text-gray-300' />
                      <p>No projects found. Create your first one to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                allProjects.map((project) => (
                  <TableRow key={project.id} className='group'>
                    <TableCell>
                      <div className='relative h-12 w-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200'>
                        {project.image && project.image.url ? (
                          <Image
                            src={project.image.url}
                            alt={project.title}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='flex items-center justify-center h-full w-full'>
                            <DraftingCompass className='h-4 w-4 text-gray-400' />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className='font-medium text-gray-900'>{project.title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary' className='font-normal font-mono text-xs'>
                        {project.slug}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={project.isActive ? 'default' : 'secondary'}
                        className='font-medium text-[10px] uppercase tracking-wider'
                      >
                        {project.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <ProjectActions project={project} />
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

function ProjectActions({
  project,
}: {
  project: NonNullable<Awaited<ReturnType<typeof getProjects>>>[number];
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
          <Link href={`/projects/${project.id}`} className='cursor-pointer'>
            <Pencil className='mr-2 h-4 w-4' />
            Edit Project
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteProjectItem id={project.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
