import { db } from '@repo/database';
import { analyticsVisits } from '@repo/database/schema';
import { desc, sql, gte } from 'drizzle-orm';
import { OverviewChart } from '../../components/analytics/overview-chart';
import { TopPagesList } from '../../components/analytics/top-pages-list';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Users, MousePointerClick } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function AnalyticsPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 1. Total Visits (Last 30 Days)
  const totalVisitsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(analyticsVisits)
    .where(gte(analyticsVisits.createdAt, thirtyDaysAgo));
  const totalVisits = Number(totalVisitsResult[0]?.count || 0);

  // 2. Daily Visits (Last 30 Days) for Chart
  // Note: Postgres date_trunc or to_char.
  const dailyVisitsResult = await db
    .select({
      date: sql<string>`to_char(${analyticsVisits.createdAt}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`,
    })
    .from(analyticsVisits)
    .where(gte(analyticsVisits.createdAt, thirtyDaysAgo))
    .groupBy(sql`to_char(${analyticsVisits.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${analyticsVisits.createdAt}, 'YYYY-MM-DD')`);

  const chartData = dailyVisitsResult.map((item) => ({
    name: item.date,
    total: Number(item.count),
  }));

  // 3. Top Pages
  const topPagesResult = await db
    .select({
      path: analyticsVisits.path,
      count: sql<number>`count(*)`,
    })
    .from(analyticsVisits)
    .groupBy(analyticsVisits.path)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  const topPagesData = topPagesResult.map((item) => ({
    path: item.path,
    visits: Number(item.count),
  }));

  // 4. Unique Visitors (Approximation by sessionId)
  const uniqueVisitorsResult = await db
    .select({ count: sql<number>`count(distinct ${analyticsVisits.sessionId})` })
    .from(analyticsVisits)
    .where(gte(analyticsVisits.createdAt, thirtyDaysAgo));
  const uniqueVisitors = Number(uniqueVisitorsResult[0]?.count || 0);

  // 5. Top Products
  const topProductsResult = await db
    .select({
      path: analyticsVisits.path,
      count: sql<number>`count(*)`,
    })
    .from(analyticsVisits)
    .where(sql`${analyticsVisits.path} LIKE '/product/%'`)
    .groupBy(analyticsVisits.path)
    .orderBy(desc(sql`count(*)`))
    .limit(5);

  const topProductsData = topProductsResult.map((item) => ({
    path: item.path,
    visits: Number(item.count),
  }));

  // 6. Top Catalogs
  const topCatalogsResult = await db
    .select({
      path: analyticsVisits.path,
      count: sql<number>`count(*)`,
    })
    .from(analyticsVisits)
    .where(sql`${analyticsVisits.path} LIKE '/catalog/%'`)
    .groupBy(analyticsVisits.path)
    .orderBy(desc(sql`count(*)`))
    .limit(5);

  const topCatalogsData = topCatalogsResult.map((item) => ({
    path: item.path,
    visits: Number(item.count),
  }));

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Analytics</h2>
          <p className='text-muted-foreground'>
            Overview of your store&apos;s performance for the last 30 days.
          </p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-blue-50/50 border-blue-100'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-blue-900'>Total Visits</CardTitle>
            <MousePointerClick className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-700'>{totalVisits}</div>
            <p className='text-xs text-blue-600/80'>Total raw page views</p>
          </CardContent>
        </Card>
        <Card className='bg-purple-50/50 border-purple-100'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-purple-900'>Unique Visitors</CardTitle>
            <Users className='h-4 w-4 text-purple-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-purple-700'>{uniqueVisitors}</div>
            <p className='text-xs text-purple-600/80'>Distinct usage sessions</p>
          </CardContent>
        </Card>
        {/* Placeholder for future metric */}
        <Card className='bg-emerald-50/50 border-emerald-100'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-emerald-900'>
              Avg. Daily Visits
            </CardTitle>
            <MousePointerClick className='h-4 w-4 text-emerald-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-emerald-700'>
              {chartData.length > 0 ? Math.round(totalVisits / 30) : 0}
            </div>
            <p className='text-xs text-emerald-600/80'>~ per day</p>
          </CardContent>
        </Card>
        <Card className='bg-amber-50/50 border-amber-100'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-amber-900'>Active Pages</CardTitle>
            <MousePointerClick className='h-4 w-4 text-amber-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-amber-700'>{topPagesData.length}</div>
            <p className='text-xs text-amber-600/80'>Pages with visits</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <OverviewChart data={chartData} className='col-span-4' />
        <TopPagesList data={topPagesData} className='col-span-3' />
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <TopPagesList
          data={topProductsData}
          title='Top Products'
          description='Most viewed products'
        />
        <TopPagesList
          data={topCatalogsData}
          title='Top Catalogs'
          description='Most viewed categories'
        />
      </div>
    </div>
  );
}
