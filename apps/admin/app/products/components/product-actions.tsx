'use client';

import { MoreHorizontal, Pencil } from 'lucide-react';
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
import { DeleteProductButton } from './delete-product-button';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
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
          <Link
            href={`/products/${product.id}`}
            className='cursor-pointer w-full flex items-center'
          >
            <Pencil className='mr-2 h-4 w-4' />
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteProductButton productId={product.id} productName={product.name} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
