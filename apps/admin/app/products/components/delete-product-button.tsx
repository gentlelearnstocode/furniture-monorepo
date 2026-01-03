"use client";

import { useState, useTransition } from "react";
import { Button } from "@repo/ui/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";
import { toast } from "sonner";
import {
  DropdownMenuItem,
} from "@repo/ui/ui/dropdown-menu";

interface DeleteProductButtonProps {
    productId: string;
    productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isConfirming, setIsConfirming] = useState(false);

    const onDelete = async () => {
        startTransition(async () => {
            try {
                const result = await deleteProduct(productId);
                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success(`${productName} deleted successfully`);
                }
            } catch (error) {
                toast.error("Failed to delete product");
            } finally {
                setIsConfirming(false);
            }
        });
    };

    if (isConfirming) {
        return (
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md border border-red-100 animate-in fade-in zoom-in duration-200">
                <span className="text-xs font-medium text-red-900">Sure?</span>
                <Button 
                    variant="destructive" 
                    size="sm" 
                    className="h-7 px-2 text-[10px]"
                    onClick={onDelete}
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Delete
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-[10px] text-gray-500 hover:text-gray-900"
                    onClick={() => setIsConfirming(false)}
                    disabled={isPending}
                >
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenuItem 
            className="text-red-600 focus:text-red-600 cursor-pointer"
            onSelect={(e) => {
                e.preventDefault();
                setIsConfirming(true);
            }}
        >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
        </DropdownMenuItem>
    );
}
