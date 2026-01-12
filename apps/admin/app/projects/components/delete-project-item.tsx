'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenuItem } from '@repo/ui/ui/dropdown-menu';
import { deleteProject } from '@/lib/actions/project';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/ui/alert-dialog';

interface DeleteProjectItemProps {
  id: string;
}

export function DeleteProjectItem({ id }: DeleteProjectItemProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteProject(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Project deleted successfully');
        setOpen(false);
      }
    });
  };

  return (
    <>
      <DropdownMenuItem
        className='text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer'
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Trash2 className='mr-2 h-4 w-4' />
        Delete Project
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and remove it
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={isPending}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              {isPending ? 'Deleting...' : 'Delete Project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
