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
            `Successfully deleted ${selectedIds.length} ${resourceName.toLowerCase()}(s)`
          );
          onClear();
        } else {
          toast.error(result.error || `Failed to delete ${resourceName.toLowerCase()}(s)`);
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      } finally {
        setShowConfirm(false);
      }
    });
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white border border-gray-200 shadow-xl px-6 py-3 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-300'>
        <div className='flex items-center gap-2 border-r border-gray-100 pr-4 mr-2'>
          <span className='flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary-100 text-[12px] font-bold text-brand-primary-700'>
            {selectedIds.length}
          </span>
          <span className='text-sm font-medium text-gray-600'>Selected</span>
        </div>

        <Button
          variant='ghost'
          size='sm'
          className='text-red-600 hover:text-red-700 hover:bg-red-50'
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </Button>

        <Button
          variant='ghost'
          size='sm'
          className='text-gray-500 hover:text-gray-700'
          onClick={onClear}
          disabled={isPending}
        >
          <X className='mr-2 h-4 w-4' />
          Cancel
        </Button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedIds.length}{' '}
              {resourceName.toLowerCase()}(s) and remove the data from our servers.
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
