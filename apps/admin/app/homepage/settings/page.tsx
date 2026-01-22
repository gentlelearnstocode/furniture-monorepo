import Link from 'next/link';
import { getLogoOverlaySettings } from '@/lib/actions/logo-overlay-settings';
import { LogoOverlayForm } from './components/logo-overlay-form';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const logoOverlaySettings = await getLogoOverlaySettings();

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
            <span className='font-medium text-gray-900'>Settings</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Image Settings</h1>
          <p className='text-base text-gray-500 mt-1'>
            Configure image processing options for product uploads.
          </p>
        </div>
      </div>

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
