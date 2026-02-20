'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/ui/table';
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Badge } from '@repo/ui/ui/badge';
import { ShieldCheck, Shield, UserX, UserCheck, Trash2 } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { BulkActions } from '@/components/ui/bulk-actions';
import { bulkDeleteUsers, toggleUserStatus, deleteUser } from '@/lib/actions/users';
import { Button } from '@repo/ui/ui/button';
import { type User } from '@repo/shared';

interface UserListProps {
  users: User[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  currentUserId: string;
}

export function UserList({ users, meta, currentUserId }: UserListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === users.filter((u) => u.id !== currentUserId).length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.filter((u) => u.id !== currentUserId).map((u) => u.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (id === currentUserId) return;
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <>
      <div className='relative overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-gray-50/50'>
              <TableHead className='w-[40px]'>
                <Checkbox
                  checked={
                    selectedIds.length === users.filter((u) => u.id !== currentUserId).length &&
                    users.length > 1
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className='min-w-[200px]'>User</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[150px] text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-48 text-center text-gray-500'>
                  <p>No users found matched your criteria.</p>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className='hover:bg-gray-50/50 transition-colors border-b last:border-0'
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(user.id)}
                      onCheckedChange={() => toggleSelect(user.id)}
                      disabled={user.id === currentUserId}
                    />
                  </TableCell>
                  <td className='px-4 py-4'>
                    <div className='font-medium text-gray-900'>
                      {user.name}
                      {user.id === currentUserId && (
                        <Badge variant='outline' className='ml-2 text-[10px] bg-gray-50'>
                          Self
                        </Badge>
                      )}
                    </div>
                    <div className='text-xs text-gray-400 font-mono'>{user.id}</div>
                  </td>
                  <td className='px-4 py-4 text-sm text-gray-600'>{user.username}</td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-1.5'>
                      {user.role === 'admin' ? (
                        <Badge
                          variant='default'
                          className='bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50'
                        >
                          <ShieldCheck className='w-3 h-3 mr-1' /> Admin
                        </Badge>
                      ) : (
                        <Badge variant='outline' className='text-gray-600'>
                          <Shield className='w-3 h-3 mr-1' /> Editor
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    {user.isActive ? (
                      <Badge
                        variant='outline'
                        className='text-green-600 bg-green-50 border-green-100'
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant='destructive'
                        className='bg-red-50 text-red-600 border-red-100 hover:bg-red-50'
                      >
                        Inactive
                      </Badge>
                    )}
                  </td>
                  <td className='px-4 py-4 text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className={
                          user.isActive
                            ? 'text-orange-600 hover:text-orange-700'
                            : 'text-green-600 hover:text-green-700'
                        }
                        disabled={currentUserId === user.id}
                        onClick={async () => {
                          await toggleUserStatus(user.id);
                        }}
                      >
                        {user.isActive ? (
                          <>
                            <UserX className='w-4 h-4 mr-1' /> Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className='w-4 h-4 mr-1' /> Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-none'
                        disabled={currentUserId === user.id}
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this user?')) {
                            await deleteUser(user.id);
                          }
                        }}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination currentPage={meta.currentPage} totalPages={meta.totalPages} />

      <BulkActions
        selectedIds={selectedIds}
        onClear={() => setSelectedIds([])}
        onDelete={bulkDeleteUsers}
        resourceName='User'
      />
    </>
  );
}
