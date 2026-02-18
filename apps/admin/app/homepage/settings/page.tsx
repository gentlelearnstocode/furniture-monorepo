import { getLogoOverlaySettings } from '@/lib/actions/logo-overlay-settings';
import { LogoOverlayForm } from './components/logo-overlay-form';
import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const logoOverlaySettings = await getLogoOverlaySettings();

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Homepage', href: '/homepage' },
          { label: 'Settings' },
        ]}
        title='Image Settings'
        description='Configure image processing options for product uploads.'
      />

      <div className='max-w-2xl'>
        <div className='rounded-lg border bg-white p-6'>
          <h2 className='text-xl font-semibold mb-4'>Logo Overlay</h2>
          <p className='text-gray-600 text-sm mb-6'>
            Automatically add your brand logo to product images when uploading. This helps protect
            your images and maintain brand consistency.
          </p>
          <LogoOverlayForm initialData={logoOverlaySettings} />
        </div>
      </div>
    </div>
  );
}
