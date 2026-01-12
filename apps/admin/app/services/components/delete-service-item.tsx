'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenuItem } from '@repo/ui/ui/dropdown-menu';
import { deleteService } from '@/lib/actions/service';
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

interface DeleteServiceItemProps {
  id: string;
}

export function DeleteServiceItem({ id }: DeleteServiceItemProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteService(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Service deleted successfully');
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
        Delete Service
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service and remove it
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
              {isPending ? 'Deleting...' : 'Delete Service'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
