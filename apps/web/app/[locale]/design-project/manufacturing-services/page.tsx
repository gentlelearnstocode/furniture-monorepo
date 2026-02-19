import { SimpleCustomPage } from '@/components/simple-custom-page';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ManufacturingServicesPage({ params }: Props) {
  const { locale } = await params;
  return <SimpleCustomPage slug='manufacturing-services' locale={locale} />;
}
