'use server';

import { db, productImportJobs } from '@repo/database';
import { eq } from 'drizzle-orm';
import type { SelectProductImportJob } from '@repo/database';

export async function getImportJobStatus(jobId: string): Promise<SelectProductImportJob | null> {
  const job = await db.query.productImportJobs.findFirst({
    where: eq(productImportJobs.id, jobId),
  });
  return job || null;
}

export async function updateImportJobProgress(
  jobId: string,
  updates: {
    processedRows?: number;
    successCount?: number;
    errorCount?: number;
    errors?: { row: number; field: string; message: string }[];
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    completedAt?: Date;
  }
) {
  await db.update(productImportJobs).set(updates).where(eq(productImportJobs.id, jobId));
}
