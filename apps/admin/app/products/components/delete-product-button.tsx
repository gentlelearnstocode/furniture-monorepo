'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/products';
import { toast } from 'sonner';
import { DropdownMenuItem } from '@repo/ui/ui/dropdown-menu';
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

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onDelete = async () => {
    startTransition(async () => {
      try {
        const result = await deleteProduct(productId);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success('Product deleted successfully');
          setOpen(false);
        }
      } catch {
        toast.error('Failed to delete product');
      }
    });
  };

  return (
    <>
      <DropdownMenuItem
        className='text-red-600 focus:text-red-600 cursor-pointer'
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Trash2 className='mr-2 h-4 w-4' />
        <span>Delete</span>
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the{' '}
              <span className='font-semibold text-gray-900'>{productName}</span> product. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Trash2 className='mr-2 h-4 w-4' />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
