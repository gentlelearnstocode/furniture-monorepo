import { db } from '@repo/database';
import Link from 'next/link';
import { ContactForm } from './components/contact-form';
import { asc } from 'drizzle-orm';
import { siteContacts } from '@repo/database';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const contacts = await db.query.siteContacts.findMany({
    orderBy: [asc(siteContacts.position)],
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <nav className='flex items-center text-sm text-gray-500 mb-1'>
            <Link href='/' className='hover:text-gray-900 transition-colors'>
              Dashboard
            </Link>
            <span className='mx-2'>/</span>
            <Link href='/homepage' className='hover:text-gray-900 transition-colors'>
              Homepage
            </Link>
            <span className='mx-2'>/</span>
            <span className='font-medium text-gray-900'>Contact Management</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Contact Management</h1>
          <p className='text-base text-gray-500 mt-1'>
            Manage your site-wide contact points like Zalo, Facebook, Messenger, and more. These
            will be displayed in the floating widget and product inquiry buttons.
          </p>
        </div>
      </div>

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
