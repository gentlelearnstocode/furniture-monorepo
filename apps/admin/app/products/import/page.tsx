'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@repo/ui/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Progress } from '@repo/ui/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/ui/alert';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { PageHeader } from '@/components/layout/page-header';

type ImportStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

interface ImportError {
  row: number;
  field: string;
  message: string;
}

interface ImportResult {
  jobId: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: ImportError[] | null;
}

export default function ProductImportPage() {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0] ?? null);
      setResult(null);
      setErrorMessage(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/products/import/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data: ImportResult = await response.json();
      setResult(data);
      setStatus('completed');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const downloadTemplate = () => {
    window.location.href = '/api/products/import/template';
  };

  const downloadErrorReport = () => {
    if (!result?.errors) return;

    // Create error report workbook
    const wb = XLSX.utils.book_new();
    const wsData = [
      ['Row', 'Field', 'Error Message'],
      ...result.errors.map((e) => [e.row, e.field, e.message]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Errors');

    // Download
    XLSX.writeFile(wb, 'import-errors.xlsx');
  };

  const resetImport = () => {
    setStatus('idle');
    setSelectedFile(null);
    setResult(null);
    setErrorMessage(null);
    setUploadProgress(0);
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Import' },
        ]}
        title='Import Products'
        description='Bulk import products from an Excel file. Images can be added via the product edit page after import.'
      />

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Template Download Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileSpreadsheet className='h-5 w-5 text-green-600' />
              Step 1: Download Template
            </CardTitle>
            <CardDescription>
              Download the Excel template and fill in your product data. The template includes
              instructions and example data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={downloadTemplate} variant='outline' className='w-full'>
              <Download className='mr-2 h-4 w-4' />
              Download Template
            </Button>
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Upload className='h-5 w-5 text-blue-600' />
              Step 2: Upload File
            </CardTitle>
            <CardDescription>
              Upload your filled template. The system will validate and import the products.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {status === 'idle' && (
              <>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : selectedFile
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  {selectedFile ? (
                    <div className='space-y-2'>
                      <FileSpreadsheet className='mx-auto h-10 w-10 text-green-600' />
                      <p className='text-sm font-medium text-gray-900'>{selectedFile.name}</p>
                      <p className='text-xs text-gray-500'>
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      <Upload className='mx-auto h-10 w-10 text-gray-400' />
                      <p className='text-sm text-gray-600'>
                        {isDragActive
                          ? 'Drop the file here...'
                          : 'Drag & drop an Excel file, or click to select'}
                      </p>
                      <p className='text-xs text-gray-500'>Supports .xlsx and .xls files</p>
                    </div>
                  )}
                </div>
                {selectedFile && (
                  <Button onClick={handleUpload} className='w-full'>
                    <Upload className='mr-2 h-4 w-4' />
                    Start Import
                  </Button>
                )}
              </>
            )}

            {(status === 'uploading' || status === 'processing') && (
              <div className='space-y-4 py-4'>
                <div className='flex items-center justify-center'>
                  <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
                </div>
                <Progress value={uploadProgress} className='h-2' />
                <p className='text-center text-sm text-gray-600'>
                  {status === 'uploading' ? 'Uploading file...' : 'Processing products...'}
                </p>
              </div>
            )}

            {status === 'error' && (
              <Alert variant='destructive'>
                <XCircle className='h-4 w-4' />
                <AlertTitle>Import Failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {status === 'completed' && result && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              {result.errorCount === 0 ? (
                <CheckCircle2 className='h-5 w-5 text-green-600' />
              ) : (
                <AlertTriangle className='h-5 w-5 text-yellow-600' />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-3 gap-4'>
              <div className='bg-brand-neutral-50 rounded-lg p-4 text-center'>
                <p className='text-2xl font-bold text-brand-neutral-900'>{result.totalRows}</p>
                <p className='text-sm text-brand-neutral-500'>Total Rows</p>
              </div>
              <div className='bg-green-50 rounded-lg p-4 text-center'>
                <p className='text-2xl font-bold text-green-600'>{result.successCount}</p>
                <p className='text-sm text-brand-neutral-500'>Imported</p>
              </div>
              <div className='bg-red-50 rounded-lg p-4 text-center'>
                <p className='text-2xl font-bold text-red-600'>{result.errorCount}</p>
                <p className='text-sm text-brand-neutral-500'>Errors</p>
              </div>
            </div>

            {result.successCount > 0 && (
              <Alert>
                <CheckCircle2 className='h-4 w-4' />
                <AlertTitle>Products Imported</AlertTitle>
                <AlertDescription>
                  {result.successCount} product(s) were successfully imported. You can now add
                  images by editing each product.
                </AlertDescription>
              </Alert>
            )}

            {result.errorCount > 0 && result.errors && (
              <div className='space-y-3'>
                <Alert variant='destructive'>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertTitle>Some Rows Failed</AlertTitle>
                  <AlertDescription>
                    {result.errorCount} row(s) had validation errors and were not imported.
                  </AlertDescription>
                </Alert>

                <div className='bg-brand-neutral-50 rounded-lg p-4 max-h-48 overflow-y-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='text-left border-b border-brand-neutral-200'>
                        <th className='pb-2 font-medium'>Row</th>
                        <th className='pb-2 font-medium'>Field</th>
                        <th className='pb-2 font-medium'>Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.errors.slice(0, 10).map((error, idx) => (
                        <tr key={idx} className='border-b border-brand-neutral-100 last:border-0'>
                          <td className='py-2'>{error.row}</td>
                          <td className='py-2 text-brand-neutral-600'>{error.field}</td>
                          <td className='py-2 text-red-600'>{error.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.errors.length > 10 && (
                    <p className='text-xs text-brand-neutral-500 mt-2'>
                      ...and {result.errors.length - 10} more errors
                    </p>
                  )}
                </div>

                <Button onClick={downloadErrorReport} variant='outline' className='w-full'>
                  <Download className='mr-2 h-4 w-4' />
                  Download Error Report
                </Button>
              </div>
            )}

            <div className='flex gap-3'>
              <Button onClick={resetImport} variant='outline'>
                Import Another File
              </Button>
              <Link href='/products'>
                <Button>View Products</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
