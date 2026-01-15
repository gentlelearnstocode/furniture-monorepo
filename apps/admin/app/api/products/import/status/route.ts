import { NextRequest, NextResponse } from 'next/server';
import { db, productImportJobs } from '@repo/database';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  try {
    const job = await db.query.productImportJobs.findFirst({
      where: eq(productImportJobs.id, jobId),
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      totalRows: job.totalRows,
      processedRows: job.processedRows,
      successCount: job.successCount,
      errorCount: job.errorCount,
      errors: job.errors,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    });
  } catch (error) {
    console.error('Failed to get job status:', error);
    return NextResponse.json({ error: 'Failed to get job status' }, { status: 500 });
  }
}
