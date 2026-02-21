import { db } from '@repo/database';
import {
  Package,
  Layers,
  LayoutGrid,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Button } from '@repo/ui/ui/button';
import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch real counts
  const [productCount, collectionCount, catalogCount, postCount, serviceCount, projectCount] =
    await Promise.all([
      db.query.products.findMany().then((res) => res.length),
      db.query.collections.findMany().then((res) => res.length),
      db.query.catalogs.findMany().then((res) => res.length),
      db.query.posts.findMany().then((res) => res.length),
      db.query.services.findMany().then((res) => res.length),
      db.query.projects.findMany().then((res) => res.length),
    ]);

  // Recent additions
  const recentProducts = await db.query.products.findMany({
    limit: 5,
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  const stats = [
    {
      title: 'Active Products',
      value: productCount.toString(),
      description: 'Items in inventory',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Catalogs',
      value: catalogCount.toString(),
      description: 'Categories & series',
      icon: LayoutGrid,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      title: 'Collections',
      value: collectionCount.toString(),
      description: 'Active promotions',
      icon: Layers,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Blog Posts',
      value: postCount.toString(),
      description: 'Published articles',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Services & Projects',
      value: (serviceCount + projectCount).toString(),
      description: 'Total active services',
      icon: Plus,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className='space-y-8 pb-10'>
      <PageHeader
        title='Dashboard'
        description='Overview of your store performance and management.'
      />

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className='border-none shadow-sm hover:shadow-md transition-shadow'
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <CardTitle className='text-sm font-medium text-gray-500'>{stat.title}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className='h-4 w-4' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <p className='text-xs text-gray-400 mt-1 flex items-center gap-1'>
                <CheckCircle2 className='h-3 w-3' />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid gap-6 md:grid-cols-7'>
        {/* Recent Activity */}
        <Card className='md:col-span-4 border-none shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Latest items added to your inventory.</CardDescription>
            </div>
            <Link href='/products'>
              <Button
                variant='ghost'
                size='sm'
                className='text-brand-primary-600 hover:text-brand-primary-700'
              >
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <div key={product.id} className='flex items-center gap-4 group'>
                    <div className='h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary-50 group-hover:text-brand-primary-500 transition-colors'>
                      <Package className='h-5 w-5' />
                    </div>
                    <div className='flex-1 space-y-1'>
                      <p className='text-sm font-medium leading-none text-gray-900'>
                        {product.name}
                      </p>
                      <p className='text-xs text-gray-500 font-mono'>{product.slug}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-semibold'>
                        ${Number(product.basePrice).toFixed(2)}
                      </p>
                      <p className='text-[10px] text-gray-400 flex items-center gap-1 justify-end'>
                        <Clock className='h-3 w-3' />
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className='py-10 text-center text-gray-500'>
                  No products found. Start by creating one.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className='md:col-span-3 space-y-6'>
          <Card className='border-none shadow-sm bg-brand-primary-900 text-white overflow-hidden relative'>
            <CardHeader>
              <CardTitle className='text-lg'>Quick Actions</CardTitle>
              <CardDescription className='text-brand-primary-100'>
                Common management tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-3 relative z-10'>
              <Link href='/products/new'>
                <Button
                  className='w-full bg-white text-brand-primary-900 hover:bg-brand-primary-50 justify-start'
                  size='sm'
                >
                  <Plus className='mr-2 h-4 w-4' /> Add New Product
                </Button>
              </Link>
              <Link href='/collections/new'>
                <Button
                  className='w-full bg-white text-brand-primary-900 hover:bg-brand-primary-50 justify-start'
                  size='sm'
                >
                  <Layers className='mr-2 h-4 w-4' /> Create Collection
                </Button>
              </Link>
              <Link href='/catalogs/new'>
                <Button
                  className='w-full bg-white text-brand-primary-900 hover:bg-brand-primary-50 justify-start'
                  size='sm'
                >
                  <LayoutGrid className='mr-2 h-4 w-4' /> Add Catalog Category
                </Button>
              </Link>
            </CardContent>
            <ArrowUpRight className='absolute -bottom-4 -right-4 h-24 w-24 text-brand-primary-800 opacity-50 rotate-12' />
          </Card>
        </div>
      </div>
    </div>
  );
}
