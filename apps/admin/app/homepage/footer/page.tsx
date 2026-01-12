import { db } from '@repo/database';
import Link from 'next/link';
import { FooterForm } from './components/footer-form';

export const dynamic = 'force-dynamic';

export default async function FooterPage() {
  const footerData = await db.query.siteFooter.findFirst({
    orderBy: (footer, { desc }) => [desc(footer.updatedAt)],
  });

  const addresses = await db.query.footerAddresses.findMany({
    orderBy: (addr, { asc }) => [asc(addr.position)],
  });

  const contacts = await db.query.footerContacts.findMany({
    orderBy: (contact, { asc }) => [asc(contact.position)],
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
            <span className='font-medium text-gray-900'>Footer Section</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Footer Management</h1>
          <p className='text-base text-gray-500 mt-1'>
            Customize the footer section of your website including company info, addresses, and
            contact information.
          </p>
        </div>
      </div>

      <div className='max-w-6xl'>
        <FooterForm
          initialData={{
            intro: footerData?.intro || '',
            description: footerData?.description || '',
            mapEmbedUrl: footerData?.mapEmbedUrl || '',
            addresses: addresses.map((addr) => ({
              id: addr.id,
              label: addr.label,
              address: addr.address,
              position: addr.position,
            })),
            contacts: contacts.map((contact) => ({
              id: contact.id,
              type: contact.type,
              label: contact.label || '',
              value: contact.value,
              position: contact.position,
            })),
          }}
        />
      </div>
    </div>
  );
}
