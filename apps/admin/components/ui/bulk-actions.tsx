'use client';

import { Button } from '@repo/ui/ui/button';
import { Trash2, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
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

interface BulkActionsProps {
  selectedIds: string[];
  onClear: () => void;
  onDelete: (ids: string[]) => Promise<{ success?: boolean; error?: string }>;
  resourceName: string;
}

export function BulkActions({ selectedIds, onClear, onDelete, resourceName }: BulkActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const result = await onDelete(selectedIds);
        if (result.success) {
          toast.success(
            `Successfully deleted ${selectedIds.length} ${resourceName.toLowerCase()}(s)`,
          );
          onClear();
        } else {
          toast.error(result.error || `Failed to delete ${resourceName.toLowerCase()}(s)`);
        }
      } catch {
        toast.error('An unexpected error occurred');
      } finally {
        setShowConfirm(false);
      }
    });
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className='sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm animate-in slide-in-from-top-2 duration-200'>
        <div className='flex items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary-100 text-xs font-bold text-brand-primary-700'>
                {selectedIds.length}
              </div>
              <span className='text-sm font-medium text-gray-700'>
                {selectedIds.length} {resourceName.toLowerCase()}
                {selectedIds.length !== 1 ? 's' : ''} selected
              </span>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
              onClick={() => setShowConfirm(true)}
              disabled={isPending}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </Button>

            <Button variant='ghost' size='sm' onClick={onClear} disabled={isPending}>
              <X className='mr-2 h-4 w-4' />
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedIds.length}{' '}
              {resourceName.toLowerCase()}
              {selectedIds.length !== 1 ? 's' : ''} and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className='bg-red-600 hover:bg-red-700'
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
