import { db } from '@repo/database';
import { ContactForm } from './components/contact-form';
import { asc } from 'drizzle-orm';
import { siteContacts } from '@repo/database';
import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const contacts = await db.query.siteContacts.findMany({
    orderBy: [asc(siteContacts.position)],
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Homepage', href: '/homepage' },
          { label: 'Contact Management' },
        ]}
        title='Contact Management'
        description='Manage your site-wide contact points like Zalo, Facebook, Messenger, and more. These will be displayed in the floating widget and product inquiry buttons.'
      />

      <div className='max-w-4xl'>
        <ContactForm
          initialData={{
            contacts: contacts.map((c) => ({
              id: c.id,
              type: c.type,
              label: c.label || '',
              value: c.value,
              isActive: c.isActive,
              position: c.position,
            })),
          }}
        />
      </div>
    </div>
  );
}
