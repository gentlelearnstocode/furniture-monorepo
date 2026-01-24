'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette,
  Highlighter,
  Image as ImageIcon,
  Table as TableIcon,
  ChevronDown,
  Check,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Eraser,
} from 'lucide-react';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Image from '@tiptap/extension-image';
import { Button } from '@repo/ui/ui/button';
import { cn } from '@repo/ui/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/ui/dropdown-menu';

// Custom Font Size Extension extending TextStyle
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize?.replace('px', ''),
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}px`,
          };
        },
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '30', '36', '48', '60', '72'];
const COLORS = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#cccccc',
  '#d9d9d9',
  '#efefef',
  '#f3f3f3',
  '#ffffff',
  '#980000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#4a86e8',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-primary-600 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Subscript,
      Superscript,
      Image.configure({
        allowBase64: true,
      }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none min-h-[150px] p-3 focus:outline-none focus:ring-0',
          'prose-headings:font-bold prose-p:my-1 prose-ul:list-disc prose-ol:list-decimal',
        ),
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className='w-full border rounded-md bg-white overflow-hidden focus-within:ring-1 focus-within:ring-brand-primary-500 focus-within:border-brand-primary-500 transition-all'>
      <div className='flex flex-wrap items-center gap-1 p-1 bg-gray-50 border-b border-gray-100 sticky top-0 z-10'>
        {/* Text Formatting */}
        <div className='flex items-center gap-0.5 p-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-gray-200 text-gray-900')}
            title='Bold'
          >
            <Bold className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-gray-200 text-gray-900')}
            title='Italic'
          >
            <Italic className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('underline') && 'bg-gray-200 text-gray-900',
            )}
            title='Underline'
          >
            <UnderlineIcon className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn('h-8 w-8 p-0', editor.isActive('strike') && 'bg-gray-200 text-gray-900')}
            title='Strikethrough'
          >
            <Strikethrough className='h-4 w-4' />
          </Button>
        </div>

        <div className='w-px h-4 bg-gray-200 mx-0.5' />

        {/* Font Size & Color */}
        <div className='flex items-center gap-0.5 p-0.5'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-8 px-2 gap-1 flex items-center'
                title='Font Size'
              >
                <Type className='h-4 w-4' />
                <span className='text-xs min-w-[2ch]'>
                  {editor.getAttributes('textStyle').fontSize || '16'}
                </span>
                <ChevronDown className='h-3 w-3 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='start'
              className='max-h-[300px] overflow-y-auto min-w-[80px]'
            >
              {FONT_SIZES.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => editor.chain().focus().setFontSize(size).run()}
                  className={cn(
                    'flex items-center justify-between',
                    editor.isActive('textStyle', { fontSize: size }) && 'bg-gray-100',
                  )}
                >
                  <span>{size}px</span>
                  {editor.isActive('textStyle', { fontSize: size }) && (
                    <Check className='h-3 w-3' />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => editor.chain().focus().unsetFontSize().run()}>
                Reset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                title='Text Color'
              >
                <Palette
                  className='h-4 w-4'
                  style={{ color: editor.getAttributes('textStyle').color || 'inherit' }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='p-2'>
              <div className='grid grid-cols-5 gap-1'>
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                    className={cn(
                      'w-6 h-6 rounded border border-gray-200 transition-transform hover:scale-110',
                      editor.isActive('textStyle', { color }) && 'ring-2 ring-brand-primary-500',
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='w-full mt-2 h-7 text-xs'
                onClick={() => editor.chain().focus().unsetColor().run()}
              >
                Reset
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                title='Highlight'
              >
                <Highlighter className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='p-2'>
              <div className='grid grid-cols-5 gap-1'>
                {['#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ff0000'].map((color) => (
                  <button
                    key={color}
                    onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                    className={cn(
                      'w-6 h-6 rounded border border-gray-200 transition-transform hover:scale-110',
                      editor.isActive('highlight', { color }) && 'ring-2 ring-brand-primary-500',
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='w-full mt-2 h-7 text-xs'
                onClick={() => editor.chain().focus().unsetHighlight().run()}
              >
                Reset
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className='w-px h-4 bg-gray-200 mx-0.5' />

        {/* Alignment */}
        <div className='flex items-center gap-0.5 p-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive({ textAlign: 'left' }) && 'bg-gray-200 text-gray-900',
            )}
            title='Align Left'
          >
            <AlignLeft className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive({ textAlign: 'center' }) && 'bg-gray-200 text-gray-900',
            )}
            title='Align Center'
          >
            <AlignCenter className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive({ textAlign: 'right' }) && 'bg-gray-200 text-gray-900',
            )}
            title='Align Right'
          >
            <AlignRight className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive({ textAlign: 'justify' }) && 'bg-gray-200 text-gray-900',
            )}
            title='Justify'
          >
            <AlignJustify className='h-4 w-4' />
          </Button>
        </div>

        <div className='w-px h-4 bg-gray-200 mx-0.5' />

        {/* Lists & Tasks */}
        <div className='flex items-center gap-0.5 p-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('bulletList') && 'bg-gray-200 text-gray-900',
            )}
            title='Bullet List'
          >
            <List className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('orderedList') && 'bg-gray-200 text-gray-900',
            )}
            title='Ordered List'
          >
            <ListOrdered className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('taskList') && 'bg-gray-200 text-gray-900',
            )}
            title='Task List'
          >
            <Check className='h-4 w-4' />
          </Button>
        </div>

        <div className='w-px h-4 bg-gray-200 mx-0.5' />

        {/* Headings */}
        <div className='flex items-center gap-0.5 p-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('heading', { level: 1 }) && 'bg-gray-200 text-gray-900',
            )}
            title='Heading 1'
          >
            <Heading1 className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('heading', { level: 2 }) && 'bg-gray-200 text-gray-900',
            )}
            title='Heading 2'
          >
            <Heading2 className='h-4 w-4' />
          </Button>
        </div>

        <div className='w-px h-4 bg-gray-200 mx-0.5' />

        {/* Links & Sub/Superscript */}
        <div className='flex items-center gap-0.5 p-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={setLink}
            className={cn('h-8 w-8 p-0', editor.isActive('link') && 'bg-gray-200 text-gray-900')}
            title='Add Link'
          >
            <LinkIcon className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive('link')}
            className='h-8 w-8 p-0'
            title='Remove Link'
          >
            <Unlink className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('subscript') && 'bg-gray-200 text-gray-900',
            )}
            title='Subscript'
          >
            <SubscriptIcon className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('superscript') && 'bg-gray-200 text-gray-900',
            )}
            title='Superscript'
          >
            <SuperscriptIcon className='h-4 w-4' />
          </Button>
        </div>

        <div className='w-px h-4 bg-gray-200 mx-0.5' />

        {/* Tables */}
        <div className='flex items-center gap-0.5 p-0.5'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type='button' variant='ghost' size='sm' className='h-8 w-8 p-0' title='Table'>
                <TableIcon className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-48'>
              <DropdownMenuItem
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
              >
                Insert Table
              </DropdownMenuItem>
              <div className='border-t my-1' />
              <DropdownMenuItem
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                disabled={!editor.isActive('table')}
              >
                Add Column Before
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                disabled={!editor.isActive('table')}
              >
                Add Column After
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().deleteColumn().run()}
                disabled={!editor.isActive('table')}
              >
                Delete Column
              </DropdownMenuItem>
              <div className='border-t my-1' />
              <DropdownMenuItem
                onClick={() => editor.chain().focus().addRowBefore().run()}
                disabled={!editor.isActive('table')}
              >
                Add Row Before
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().addRowAfter().run()}
                disabled={!editor.isActive('table')}
              >
                Add Row After
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().deleteRow().run()}
                disabled={!editor.isActive('table')}
              >
                Delete Row
              </DropdownMenuItem>
              <div className='border-t my-1' />
              <DropdownMenuItem
                onClick={() => editor.chain().focus().deleteTable().run()}
                disabled={!editor.isActive('table')}
                className='text-red-600 focus:text-red-600'
              >
                Delete Table
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className='w-px h-4 bg-gray-200 mx-0.5' />

        {/* Actions */}
        <div className='flex items-center gap-0.5 p-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className='h-8 w-8 p-0'
            title='Clear Formatting'
          >
            <Eraser className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => {
              const url = window.prompt('Image URL');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className='h-8 w-8 p-0'
            title='Insert Image'
          >
            <ImageIcon className='h-4 w-4' />
          </Button>
        </div>

        <div className='flex-1' />

        {/* Undo/Redo */}
        <div className='flex items-center gap-0.5 p-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className='h-8 w-8 p-0'
            title='Undo'
          >
            <Undo className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className='h-8 w-8 p-0'
            title='Redo'
          >
            <Redo className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
