'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/ui/table';
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Badge } from '@repo/ui/ui/badge';
import Image from 'next/image';
import { DraftingCompass, MoreHorizontal, Pencil } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { BulkActions } from '@/components/ui/bulk-actions';
import { bulkDeleteProjects } from '@/lib/actions/project';
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
import { DeleteProjectItem } from './delete-project-item';
import { type Project } from '@repo/shared';

interface ProjectListProps {
  projects: Project[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export function ProjectList({ projects, meta }: ProjectListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map((p) => p.id));
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
                  checked={selectedIds.length === projects.length && projects.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className='w-[100px]'>Image</TableHead>
              <TableHead className='min-w-[200px]'>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[100px] text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-48 text-center text-gray-500'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <DraftingCompass className='h-8 w-8 text-gray-300' />
                    <p>No projects found matched your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className='group'>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(project.id)}
                      onCheckedChange={() => toggleSelect(project.id)}
                    />
                  </TableCell>
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
                    {project.createdBy ? (
                      <span className='text-sm text-gray-600'>
                        {project.createdBy.name || project.createdBy.email}
                      </span>
                    ) : (
                      <span className='text-gray-400 text-xs'>-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={project.isActive ? 'default' : 'secondary'}
                      className={
                        project.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }
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
      </div>

      <Pagination currentPage={meta.currentPage} totalPages={meta.totalPages} />

      <BulkActions
        selectedIds={selectedIds}
        onClear={() => setSelectedIds([])}
        onDelete={bulkDeleteProjects}
        resourceName='Project'
      />
    </>
  );
}

function ProjectActions({ project }: { project: Project }) {
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
