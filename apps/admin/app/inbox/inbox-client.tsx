'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Search, Mail, Phone } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { Input } from '@repo/ui/ui/input';
import { Button } from '@repo/ui/ui/button';
import { Separator } from '@repo/ui/ui/separator';
import { Avatar, AvatarFallback } from '@repo/ui/ui/avatar';
import { toast } from 'sonner';
import { markAsRead } from './actions';

interface Message {
  id: string;
  name: string;
  phoneNumber: string;
  email: string | null;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

interface InboxClientProps {
  initialMessages: Message[];
}

export function InboxClient({ initialMessages }: InboxClientProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedMessage = messages.find((m) => m.id === selectedId);

  const filteredMessages = messages.filter((message) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      message.name.toLowerCase().includes(searchLower) ||
      message.content.toLowerCase().includes(searchLower) ||
      message.phoneNumber.includes(searchLower) ||
      (message.email && message.email.toLowerCase().includes(searchLower))
    );
  });

  const handleSelectMessage = async (message: Message) => {
    setSelectedId(message.id);
    if (!message.isRead) {
      // Optimistic update
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m)));

      const result = await markAsRead(message.id);
      if (!result.success) {
        toast.error('Failed to mark as read');
        // Revert if needed, but usually fine
      }
    }
  };

  return (
    <div className='flex h-full flex-col md:flex-row bg-background'>
      {/* Left Pane: Message List */}
      <div
        className={cn(
          'flex flex-col border-r w-full md:w-[350px] lg:w-[400px]',
          selectedId ? 'hidden md:flex' : 'flex',
        )}
      >
        <div className='p-4 border-b'>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search messages...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className='flex-1 overflow-y-auto'>
          <div className='flex flex-col gap-0 p-0'>
            {filteredMessages.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-8 text-center text-muted-foreground'>
                <Mail className='h-8 w-8 mb-2 opacity-50' />
                <p>No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex flex-col gap-2 p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors',
                    selectedId === message.id
                      ? 'bg-muted'
                      : message.isRead
                        ? 'bg-background'
                        : 'bg-blue-50/50 dark:bg-blue-950/20',
                  )}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={cn(
                          'font-semibold text-sm',
                          !message.isRead && 'text-brand-primary-700 dark:text-brand-primary-400',
                        )}
                      >
                        {message.name}
                      </span>
                      {!message.isRead && <span className='h-2 w-2 rounded-full bg-blue-600' />}
                    </div>
                    <span className='text-xs text-muted-foreground whitespace-nowrap ml-2'>
                      {format(new Date(message.createdAt), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <span className='truncate'>{message.phoneNumber}</span>
                  </div>
                  <p
                    className={cn(
                      'text-sm line-clamp-2 text-muted-foreground',
                      !message.isRead && 'text-foreground font-medium',
                    )}
                  >
                    {message.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Pane: Message Detail */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 bg-background',
          !selectedId ? 'hidden md:flex' : 'flex',
        )}
      >
        {selectedMessage ? (
          <>
            <div className='flex items-center justify-between p-4 border-b h-[69px]'>
              <div className='flex items-center gap-2 md:hidden'>
                <Button variant='ghost' size='sm' onClick={() => setSelectedId(null)}>
                  &larr; Back
                </Button>
              </div>
              <div className='flex items-center gap-2 ml-auto'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                >
                  <Mail className='h-4 w-4 mr-2' />
                  Reply Email
                </Button>
                {/* Additional actions like delete could go here */}
              </div>
            </div>
            <div className='flex-1 overflow-y-auto p-0'>
              <div className='p-6 max-w-3xl mx-auto space-y-8'>
                {/* Sender Header */}
                <div className='flex items-start gap-4'>
                  <Avatar className='h-12 w-12'>
                    <AvatarFallback className='text-lg bg-brand-primary-100 text-brand-primary-700'>
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-xl font-semibold'>{selectedMessage.name}</h2>
                      <span className='text-sm text-muted-foreground'>
                        {format(new Date(selectedMessage.createdAt), 'PPpp')}
                      </span>
                    </div>
                    <div className='flex flex-col gap-1 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-2'>
                        <Phone className='h-3.5 w-3.5' />
                        <a
                          href={`tel:${selectedMessage.phoneNumber}`}
                          className='hover:text-brand-primary-600 hover:underline'
                        >
                          {selectedMessage.phoneNumber}
                        </a>
                      </div>
                      {selectedMessage.email && (
                        <div className='flex items-center gap-2'>
                          <Mail className='h-3.5 w-3.5' />
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className='hover:text-brand-primary-600 hover:underline'
                          >
                            {selectedMessage.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Content */}
                <div className='prose prose-sm max-w-none dark:prose-invert'>
                  <p className='whitespace-pre-wrap text-base leading-relaxed text-foreground'>
                    {selectedMessage.content}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-muted-foreground'>
            <div className='w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4'>
              <Mail className='h-8 w-8 opacity-50' />
            </div>
            <p className='text-lg font-medium'>Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
