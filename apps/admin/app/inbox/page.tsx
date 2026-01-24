import { db, inboxMessages } from '@repo/database';
import { desc } from 'drizzle-orm';
import { InboxClient } from './inbox-client';
import { Suspense } from 'react';

export default async function InboxPage() {
  const messages = await db.query.inboxMessages.findMany({
    orderBy: [desc(inboxMessages.createdAt)],
  });

  return (
    <div className='h-full flex-1 flex flex-col min-w-0 overflow-hidden'>
      <Suspense fallback={<div className='p-4'>Loading messages...</div>}>
        <InboxClient initialMessages={messages} />
      </Suspense>
    </div>
  );
}
