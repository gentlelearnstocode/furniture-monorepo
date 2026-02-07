'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@repo/ui/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@repo/ui/ui/sheet';
import Image from 'next/image';
import { cn } from '@repo/ui/lib/utils';
import { Badge } from '@repo/ui/ui/badge';
import { Separator } from '@repo/ui/ui/separator';

import { ShowroomForm } from '@/components/forms/showroom-form';
import { deleteShowroom, reorderShowrooms } from '@/lib/actions/showrooms';

interface ShowroomItemType {
  id: string;
  title: string;
  titleVi: string | null;
  subtitle: string | null;
  subtitleVi: string | null;
  contentHtml: string | null;
  contentHtmlVi: string | null;
  imageId: string | null;
  position: number;
  isActive: boolean;
  image?: { url: string } | null;
  updatedAt: Date;
}

interface ShowroomManagerProps {
  initialItems: ShowroomItemType[];
}

function SortableShowroomItem({
  item,
  onEdit,
  onDelete,
}: {
  item: ShowroomItemType;
  onEdit: (item: ShowroomItemType) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-4 p-4 bg-white border rounded-lg group',
        isDragging && 'opacity-50 shadow-lg',
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className='cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600'
      >
        <GripVertical className='h-5 w-5' />
      </button>

      <div className='h-16 w-24 relative bg-gray-100 rounded overflow-hidden flex-shrink-0'>
        {item.image?.url ? (
          <Image src={item.image.url} alt={item.title} fill className='object-cover' />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-xs text-gray-400'>
            No Image
          </div>
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <h4 className='font-medium truncate'>{item.title}</h4>
          {!item.isActive && (
            <Badge variant='secondary' className='text-xs'>
              Inactive
            </Badge>
          )}
        </div>
        <p className='text-sm text-gray-500 truncate'>{item.subtitle || 'No subtitle'}</p>
      </div>

      <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
        <Button variant='ghost' size='icon' onClick={() => onEdit(item)}>
          <Pencil className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='text-red-500 hover:text-red-600 hover:bg-red-50'
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

export function ShowroomManager({ initialItems }: ShowroomManagerProps) {
  const [items, setItems] = useState<ShowroomItemType[]>(initialItems);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShowroomItemType | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Trigger server reorder
        const reorderPayload = newItems.map((item, index) => ({
          id: item.id,
          position: index,
        }));

        reorderShowrooms(reorderPayload).then((res) => {
          if (res.error) toast.error('Failed to save order');
        });

        return newItems;
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this showroom?')) {
      const result = await deleteShowroom(id);
      if (result.success) {
        toast.success('Showroom deleted');
        router.refresh();
      } else {
        toast.error('Failed to delete');
      }
    }
  };

  const handleEdit = (item: ShowroomItemType) => {
    setEditingItem(item);
    setIsSheetOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsSheetOpen(true);
  };

  const handleFormSuccess = () => {
    setIsSheetOpen(false);
    router.refresh();
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Showroom Items</h2>
        <Button onClick={handleAddNew}>
          <Plus className='mr-2 h-4 w-4' />
          Add Showroom
        </Button>
      </div>

      <Separator />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className='space-y-3'>
            {items.map((item) => (
              <SortableShowroomItem
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            {items.length === 0 && (
              <div className='text-center py-12 text-gray-500 border-2 border-dashed rounded-lg'>
                No showrooms yet. Click &quot;Add Showroom&quot; to create one.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className='sm:max-w-2xl overflow-y-auto'>
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit Showroom' : 'New Showroom'}</SheetTitle>
          </SheetHeader>
          <div className='mt-6'>
            <ShowroomForm
              initialData={editingItem}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
