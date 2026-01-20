'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@repo/ui/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Plus, GripVertical, Trash2, X, Save, Loader2, LayoutGrid, ImageIcon } from 'lucide-react';
import { saveFeaturedLayout, type LayoutRow } from '@/lib/actions/featured-layout';
import { cn } from '@repo/ui/lib/utils';

type Catalog = {
  id: string;
  name: string;
  slug: string;
  image?: { url: string } | null;
};

type RowItem = {
  id: string;
  catalogId: string;
  position: number;
  catalog?: Catalog;
};

type Row = {
  id: string;
  position: number;
  columns: number;
  items: RowItem[];
};

interface LayoutBuilderProps {
  initialRows: Row[];
  availableCatalogs: Catalog[];
}

function SortableRow({
  row,
  onColumnsChange,
  onRemove,
  onAddCatalog,
  onRemoveCatalog,
  availableCatalogs,
  usedCatalogIds,
}: {
  row: Row;
  onColumnsChange: (columns: number) => void;
  onRemove: () => void;
  onAddCatalog: (catalogId: string, position: number) => void;
  onRemoveCatalog: (position: number) => void;
  availableCatalogs: Catalog[];
  usedCatalogIds: Set<string>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const slots = Array.from({ length: row.columns }, (_, i) => i);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white border rounded-lg shadow-sm transition-shadow',
        isDragging && 'shadow-lg ring-2 ring-blue-500/50',
      )}
    >
      {/* Row Header */}
      <div className='flex items-center justify-between gap-4 p-4 border-b bg-gray-50/50 rounded-t-lg'>
        <div className='flex items-center gap-3'>
          <button
            {...attributes}
            {...listeners}
            className='cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors'
          >
            <GripVertical className='h-5 w-5 text-gray-400' />
          </button>
          <span className='font-medium text-gray-700'>Row {row.position + 1}</span>
        </div>

        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <LayoutGrid className='h-4 w-4 text-gray-500' />
            <Select
              value={row.columns.toString()}
              onValueChange={(v) => onColumnsChange(parseInt(v))}
            >
              <SelectTrigger className='w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>1 Column</SelectItem>
                <SelectItem value='2'>2 Columns</SelectItem>
                <SelectItem value='3'>3 Columns</SelectItem>
                <SelectItem value='4'>4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant='ghost'
            size='icon'
            onClick={onRemove}
            className='text-red-500 hover:text-red-700 hover:bg-red-50'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Catalog Slots */}
      <div className={cn('p-4 grid gap-3', `grid-cols-${row.columns}`)}>
        {slots.map((slotIndex) => {
          const item = row.items.find((i) => i.position === slotIndex);
          const catalog = item?.catalog;

          if (catalog) {
            return (
              <div
                key={slotIndex}
                className='relative group bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden aspect-[16/9]'
              >
                {catalog.image?.url && (
                  <Image
                    src={catalog.image.url}
                    alt={catalog.name}
                    fill
                    className='object-cover opacity-80'
                  />
                )}
                <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                  <span className='text-white font-medium text-sm text-center px-2'>
                    {catalog.name}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveCatalog(slotIndex)}
                  className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'
                >
                  <X className='h-3 w-3' />
                </button>
              </div>
            );
          }

          const unusedCatalogs = availableCatalogs.filter((c) => !usedCatalogIds.has(c.id));

          return (
            <div
              key={slotIndex}
              className='border-2 border-dashed border-gray-300 rounded-lg aspect-[16/9] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors'
            >
              {unusedCatalogs.length > 0 ? (
                <Select onValueChange={(catalogId) => onAddCatalog(catalogId, slotIndex)}>
                  <SelectTrigger className='w-[160px] border-gray-300'>
                    <div className='flex items-center gap-2 text-gray-500'>
                      <ImageIcon className='h-4 w-4' />
                      <span>Add Catalog</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {unusedCatalogs.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className='text-gray-400 text-sm'>No catalogs available</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LayoutBuilder({ initialRows, availableCatalogs }: LayoutBuilderProps) {
  const [rows, setRows] = useState<Row[]>(() => (initialRows.length > 0 ? initialRows : []));
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Get all used catalog IDs
  const usedCatalogIds = new Set(rows.flatMap((r) => r.items.map((i) => i.catalogId)));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRows((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update positions
        return newItems.map((row, idx) => ({ ...row, position: idx }));
      });
    }
  }

  function addRow() {
    const newRow: Row = {
      id: `new-${Date.now()}`,
      position: rows.length,
      columns: 3,
      items: [],
    };
    setRows([...rows, newRow]);
  }

  function updateRowColumns(rowId: string, columns: number) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        // Keep only items that fit in new column count
        const items = row.items.filter((i) => i.position < columns);
        return { ...row, columns, items };
      }),
    );
  }

  function removeRow(rowId: string) {
    setRows((prev) => {
      const filtered = prev.filter((r) => r.id !== rowId);
      // Reorder positions
      return filtered.map((row, idx) => ({ ...row, position: idx }));
    });
  }

  function addCatalogToRow(rowId: string, catalogId: string, position: number) {
    const catalog = availableCatalogs.find((c) => c.id === catalogId);
    if (!catalog) return;

    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const newItem: RowItem = {
          id: `item-${Date.now()}`,
          catalogId,
          position,
          catalog,
        };
        return { ...row, items: [...row.items, newItem] };
      }),
    );
  }

  function removeCatalogFromRow(rowId: string, position: number) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        return { ...row, items: row.items.filter((i) => i.position !== position) };
      }),
    );
  }

  function handleSave() {
    const layoutRows: LayoutRow[] = rows
      .filter((r) => r.items.length > 0)
      .map((r) => ({
        position: r.position,
        columns: r.columns,
        items: r.items.map((i) => ({
          catalogId: i.catalogId,
          position: i.position,
        })),
      }));

    startTransition(async () => {
      const result = await saveFeaturedLayout(layoutRows);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Layout saved successfully!');
      }
    });
  }

  return (
    <div className='space-y-6'>
      {/* Toolbar */}
      <div className='flex items-center justify-between'>
        <div className='text-sm text-gray-500'>
          {rows.length === 0
            ? 'Add rows to create your featured catalog layout'
            : `${rows.length} row${rows.length > 1 ? 's' : ''} • ${usedCatalogIds.size} catalog${usedCatalogIds.size !== 1 ? 's' : ''} assigned`}
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='outline' onClick={addRow}>
            <Plus className='h-4 w-4 mr-2' />
            Add Row
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                Save Layout
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Rows */}
      {rows.length === 0 ? (
        <Card className='border-dashed'>
          <CardContent className='py-12 flex flex-col items-center justify-center text-center'>
            <LayoutGrid className='h-12 w-12 text-gray-300 mb-4' />
            <h3 className='font-medium text-gray-900 mb-1'>No Layout Configured</h3>
            <p className='text-gray-500 text-sm mb-4'>
              Create rows to organize how catalogs appear on your homepage
            </p>
            <Button onClick={addRow}>
              <Plus className='h-4 w-4 mr-2' />
              Add First Row
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          id='layout-builder-dnd'
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            <div className='space-y-4'>
              {rows.map((row) => (
                <SortableRow
                  key={row.id}
                  row={row}
                  onColumnsChange={(cols) => updateRowColumns(row.id, cols)}
                  onRemove={() => removeRow(row.id)}
                  onAddCatalog={(catalogId, pos) => addCatalogToRow(row.id, catalogId, pos)}
                  onRemoveCatalog={(pos) => removeCatalogFromRow(row.id, pos)}
                  availableCatalogs={availableCatalogs}
                  usedCatalogIds={usedCatalogIds}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Preview Info */}
      {rows.length > 0 && (
        <Card className='bg-blue-50/50 border-blue-200'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-blue-900'>Layout Preview</CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <p className='text-blue-700 text-sm'>
              This layout will display {usedCatalogIds.size} catalog
              {usedCatalogIds.size !== 1 ? 's' : ''} across{' '}
              {rows.filter((r) => r.items.length > 0).length} row
              {rows.filter((r) => r.items.length > 0).length !== 1 ? 's' : ''} on your homepage.
              Empty rows will not be shown.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
