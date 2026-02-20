'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Check, ExternalLink, Info, AlertTriangle, Play, Package } from 'lucide-react';
import { Button } from '@repo/ui/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/ui/dropdown-menu';
import { getNotifications, markAsRead, markAllAsRead } from '@/lib/actions/notifications';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { cn } from '@repo/ui/lib/utils';
import { toast } from 'sonner';
import { type Notification, type NotificationType } from '@repo/shared';

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = (await getNotifications()) as Notification[];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Simple polling every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const res = await markAsRead(id);
    if ('success' in res) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead();
    if ('success' in res) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'entity_created':
        return <Package className='h-4 w-4 text-green-500' />;
      case 'entity_updated':
        return <Play className='h-4 w-4 text-blue-500' />;
      case 'entity_deleted':
        return <AlertTriangle className='h-4 w-4 text-red-500' />;
      default:
        return <Info className='h-4 w-4 text-gray-500' />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative text-gray-400'>
          <Bell className='w-5 h-5' />
          {unreadCount > 0 && (
            <span className='absolute top-2.5 right-2.5 w-2 h-2 bg-brand-primary-500 rounded-full border-2 border-white' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80' align='end'>
        <DropdownMenuLabel className='flex items-center justify-between font-inter'>
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              className='h-auto p-0 text-xs text-brand-primary-600 hover:text-brand-primary-700 hover:bg-transparent'
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className='h-[400px] overflow-y-auto'>
          {loading ? (
            <div className='p-4 text-center text-sm text-gray-500'>Loading...</div>
          ) : notifications.length === 0 ? (
            <div className='p-4 text-center text-sm text-gray-500'>No notifications</div>
          ) : (
            <div className='flex flex-col'>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex flex-col gap-1 p-4 border-b border-gray-50 transition-colors hover:bg-gray-50 cursor-default',
                    !notification.isRead && 'bg-brand-primary-50/30'
                  )}
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      {getIcon(notification.type)}
                      <span className='font-semibold text-sm line-clamp-1'>
                        {notification.title}
                      </span>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6 text-gray-400 hover:text-brand-primary-600'
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                  <p className='text-xs text-gray-600 line-clamp-2'>{notification.message}</p>
                  <div className='flex items-center justify-between mt-1'>
                    <span className='text-[10px] text-gray-400'>
                      {formatDistanceToNow(new Date(notification.createdAt || new Date()), { addSuffix: true })}
                    </span>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className='text-[10px] text-brand-primary-600 hover:underline flex items-center gap-0.5'
                      >
                        View <ExternalLink className='h-2 w-2' />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
