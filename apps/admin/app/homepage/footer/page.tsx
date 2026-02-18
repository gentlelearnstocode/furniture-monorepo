import { db } from '@repo/database';
import { FooterForm } from './components/footer-form';
import { PageHeader } from '@/components/layout/page-header';

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

  const socialLinks = await db.query.footerSocialLinks.findMany({
    orderBy: (link, { asc }) => [asc(link.position)],
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Homepage', href: '/homepage' },
          { label: 'Footer Section' },
        ]}
        title='Footer Management'
        description='Customize the footer section of your website including company info, addresses, and contact information.'
      />

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
            socialLinks: socialLinks.map((link) => ({
              id: link.id,
              platform: link.platform,
              url: link.url,
              isActive: link.isActive,
              position: link.position,
            })),
          }}
        />
      </div>
    </div>
  );
}
