import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Layout } from 'lucide-react';

export default function IntroSectionPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Intro Section</h1>
        <p className='text-base text-gray-500 mt-1'>
          Manage the introduction section of your home page.
        </p>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This feature is currently under development.</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center h-64 text-gray-400'>
          <Layout className='h-12 w-12 mb-4 opacity-20' />
          <p>Placeholder for Intro Section Management</p>
        </CardContent>
      </Card>
    </div>
  );
}
