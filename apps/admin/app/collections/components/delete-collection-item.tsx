"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@repo/ui/ui/dropdown-menu";
import { deleteCollection } from "@/lib/actions/collections";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/ui/alert-dialog";

interface DeleteCollectionItemProps {
  id: string;
}

export function DeleteCollectionItem({ id }: DeleteCollectionItemProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteCollection(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Collection deleted successfully");
        setOpen(false);
      }
    });
  };

  return (
    <>
      <DropdownMenuItem 
        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Collection
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the collection
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? "Deleting..." : "Delete Collection"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
