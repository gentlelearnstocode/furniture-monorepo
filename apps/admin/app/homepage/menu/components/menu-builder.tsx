'use client';

import React from 'react';
import {
  Check,
  ChevronsUpDown,
  GripVertical,
  X,
  Folder,
  FolderOpen,
  Briefcase,
} from 'lucide-react';
import { Button } from '@repo/ui/ui/button';
import { Badge } from '@repo/ui/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/ui/popover';
import { cn } from '@repo/ui/lib/utils';
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

interface MenuItemOption {
  id: string;
  name: string;
  slug: string;
  type: 'catalog' | 'subcatalog' | 'service';
  parentName: string | null;
  image: { url: string } | null;
}

interface SelectedMenuItem {
  id: string;
  itemType: 'catalog' | 'subcatalog' | 'service';
  catalogId: string | null;
  serviceId: string | null;
  position: number;
  isActive: boolean;
  // Display data
  name: string;
  slug: string;
}

interface MenuBuilderProps {
  availableItems: MenuItemOption[];
  initialSelectedItems: SelectedMenuItem[];
  onSave: (items: SelectedMenuItem[]) => Promise<{ success?: boolean; error?: string }>;
}

function SortableItem({
  item,
  onRemove,
}: {
  item: SelectedMenuItem;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getTypeIcon = () => {
    switch (item.itemType) {
      case 'catalog':
        return <Folder className='h-4 w-4' />;
      case 'subcatalog':
        return <FolderOpen className='h-4 w-4' />;
      case 'service':
        return <Briefcase className='h-4 w-4' />;
    }
  };

  const getTypeBadge = () => {
    switch (item.itemType) {
      case 'catalog':
        return (
          <Badge variant='default' className='bg-blue-100 text-blue-800 hover:bg-blue-100'>
            Catalog
          </Badge>
        );
      case 'subcatalog':
        return (
          <Badge variant='default' className='bg-purple-100 text-purple-800 hover:bg-purple-100'>
            Subcatalog
          </Badge>
        );
      case 'service':
        return (
          <Badge variant='default' className='bg-green-100 text-green-800 hover:bg-green-100'>
            Service
          </Badge>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 bg-white border rounded-lg',
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
      <div className='flex-1 flex items-center gap-3'>
        {getTypeIcon()}
        <span className='font-medium'>{item.name}</span>
        {getTypeBadge()}
      </div>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onRemove(item.id)}
        className='h-8 w-8 p-0 text-gray-400 hover:text-red-600'
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
}

export function MenuBuilder({ availableItems, initialSelectedItems, onSave }: MenuBuilderProps) {
  const [selectedItems, setSelectedItems] =
    React.useState<SelectedMenuItem[]>(initialSelectedItems);
  const [open, setOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          position: index,
        }));
      });
    }
  };

  const handleSelect = (option: MenuItemOption) => {
    // Check if already selected
    const isAlreadySelected = selectedItems.some(
      (item) =>
        (option.type === 'service' && item.serviceId === option.id) ||
        ((option.type === 'catalog' || option.type === 'subcatalog') &&
          item.catalogId === option.id),
    );

    if (isAlreadySelected) {
      return;
    }

    const newItem: SelectedMenuItem = {
      id: crypto.randomUUID(),
      itemType: option.type,
      catalogId: option.type !== 'service' ? option.id : null,
      serviceId: option.type === 'service' ? option.id : null,
      position: selectedItems.length,
      isActive: true,
      name: option.name,
      slug: option.slug,
    };

    setSelectedItems([...selectedItems, newItem]);
    setOpen(false);
  };

  const handleRemove = (id: string) => {
    setSelectedItems(
      selectedItems
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, position: index })),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    const result = await onSave(selectedItems);

    if (result.success) {
      setSaveMessage({ type: 'success', text: 'Menu saved successfully!' });
    } else {
      setSaveMessage({ type: 'error', text: result.error || 'Failed to save menu' });
    }

    setIsSaving(false);

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const getOptionLabel = (option: MenuItemOption) => {
    if (option.parentName) {
      return `${option.parentName} → ${option.name}`;
    }
    return option.name;
  };

  const isOptionSelected = (option: MenuItemOption) => {
    return selectedItems.some(
      (item) =>
        (option.type === 'service' && item.serviceId === option.id) ||
        ((option.type === 'catalog' || option.type === 'subcatalog') &&
          item.catalogId === option.id),
    );
  };

  // Group available items by type
  const catalogItems = availableItems.filter((item) => item.type === 'catalog');
  const subcatalogItems = availableItems.filter((item) => item.type === 'subcatalog');
  const serviceItems = availableItems.filter((item) => item.type === 'service');

  return (
    <div className='space-y-6'>
      {/* Add Items Section */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>Add Menu Items</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='w-full justify-between'
            >
              Select catalogs, subcatalogs, or services...
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-full p-0' align='start'>
            <Command>
              <CommandInput placeholder='Search...' />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                {catalogItems.length > 0 && (
                  <CommandGroup heading='Catalogs'>
                    {catalogItems.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.name}
                        onSelect={() => handleSelect(option)}
                        disabled={isOptionSelected(option)}
                        className={cn(isOptionSelected(option) && 'opacity-50')}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isOptionSelected(option) ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <Folder className='mr-2 h-4 w-4 text-blue-600' />
                        {option.name}
                        <Badge variant='outline' className='ml-auto text-xs'>
                          Catalog
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {subcatalogItems.length > 0 && (
                  <CommandGroup heading='Subcatalogs'>
                    {subcatalogItems.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={getOptionLabel(option)}
                        onSelect={() => handleSelect(option)}
                        disabled={isOptionSelected(option)}
                        className={cn(isOptionSelected(option) && 'opacity-50')}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isOptionSelected(option) ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <FolderOpen className='mr-2 h-4 w-4 text-purple-600' />
                        {getOptionLabel(option)}
                        <Badge variant='outline' className='ml-auto text-xs'>
                          Subcatalog
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {serviceItems.length > 0 && (
                  <CommandGroup heading='Services'>
                    {serviceItems.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.name}
                        onSelect={() => handleSelect(option)}
                        disabled={isOptionSelected(option)}
                        className={cn(isOptionSelected(option) && 'opacity-50')}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isOptionSelected(option) ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <Briefcase className='mr-2 h-4 w-4 text-green-600' />
                        {option.name}
                        <Badge variant='outline' className='ml-auto text-xs'>
                          Service
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Items List */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          Menu Order ({selectedItems.length} items)
        </label>
        {selectedItems.length === 0 ? (
          <div className='text-center py-8 text-gray-500 border-2 border-dashed rounded-lg'>
            No items selected. Add items from the selector above.
          </div>
        ) : (
          <DndContext
            id='menu-builder-dnd'
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='space-y-2'>
                {selectedItems.map((item) => (
                  <SortableItem key={item.id} item={item} onRemove={handleRemove} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Save Button */}
      <div className='flex items-center gap-4'>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Menu Configuration'}
        </Button>
        {saveMessage && (
          <span
            className={cn(
              'text-sm',
              saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600',
            )}
          >
            {saveMessage.text}
          </span>
        )}
      </div>
    </div>
  );
}
