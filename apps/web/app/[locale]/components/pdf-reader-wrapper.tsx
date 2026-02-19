'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const PdfBookReader = dynamic(() => import('./pdf-book-reader'), {
  ssr: false,
});

interface PdfReaderWrapperProps {
  pdfUrl: string;
}

export function PdfReaderWrapper({ pdfUrl }: PdfReaderWrapperProps) {
  return <PdfBookReader pdfUrl={pdfUrl} />;
}
