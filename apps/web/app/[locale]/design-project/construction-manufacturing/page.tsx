import { SimpleCustomPage } from '@/components/simple-custom-page';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ConstructionManufacturingPage({ params }: Props) {
  const { locale } = await params;
  return <SimpleCustomPage slug='construction-manufacturing' locale={locale} />;
}
