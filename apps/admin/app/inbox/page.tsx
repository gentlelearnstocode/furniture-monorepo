import { db, inboxMessages } from '@repo/database';
import { desc } from 'drizzle-orm';
import { InboxClient } from './inbox-client';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layout/page-header';

export default async function InboxPage() {
  const messages = await db.query.inboxMessages.findMany({
    orderBy: [desc(inboxMessages.createdAt)],
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Inbox' }]}
        title='Inbox'
        description='Manage and respond to customer inquiries.'
      />

      <div className='h-[calc(100vh-16rem)] min-h-[600px] flex flex-col min-w-0 overflow-hidden border border-brand-neutral-200 rounded-lg bg-white'>
        <Suspense fallback={<div className='p-4'>Loading messages...</div>}>
          <InboxClient initialMessages={messages} />
        </Suspense>
      </div>
    </div>
  );
}
