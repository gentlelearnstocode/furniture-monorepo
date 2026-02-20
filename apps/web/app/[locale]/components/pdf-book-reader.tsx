'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLPageFlip from 'react-pageflip';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PdfBookReaderProps {
  pdfUrl: string;
}

const PageContent = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  (props, ref) => {
    return (
      <div className='bg-white shadow-lg' ref={ref}>
        {props.children}
      </div>
    );
  },
);

PageContent.displayName = 'PageContent';

interface PageFlipRef {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
  };
}

export default function PdfBookReader({ pdfUrl }: PdfBookReaderProps) {
  useEffect(() => {
    // Setup pdfjs worker only on client
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []);

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef<PageFlipRef>(null); // react-pageflip doesn't export a clear ref type easily
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const onPage = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const nextButtonClick = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const prevButtonClick = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  const isMobile = windowWidth < 768;
  const bookWidth = isMobile ? windowWidth - 40 : Math.min(windowWidth * 0.8, 1000);
  const bookHeight = isMobile ? bookWidth * 1.414 : (bookWidth / 2) * 1.414;

  return (
    <div className='flex flex-col items-center py-12 bg-white'>
      <div className='relative group'>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className='flex items-center justify-center p-20'>
              <Loader2 className='w-8 h-8 animate-spin text-brand-primary-800' />
            </div>
          }
        >
          {numPages > 0 && (
            <div className='flex items-center gap-4'>
              <button
                onClick={prevButtonClick}
                className='hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors z-30'
                disabled={currentPage === 0}
              >
                <ChevronLeft className='w-6 h-6 text-gray-600' />
              </button>

              <HTMLPageFlip
                width={isMobile ? bookWidth : bookWidth / 2}
                height={bookHeight}
                size='fixed'
                minWidth={315}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1533}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={onPage}
                className='shadow-2xl'
                style={{}}
                startPage={0}
                drawShadow={true}
                flippingTime={1000}
                usePortrait={isMobile}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                ref={bookRef}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <PageContent key={`page_${index + 1}`}>
                    <Page
                      pageNumber={index + 1}
                      width={isMobile ? bookWidth : bookWidth / 2}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  </PageContent>
                ))}
              </HTMLPageFlip>

              <button
                onClick={nextButtonClick}
                className='hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors z-30'
                disabled={currentPage >= numPages - 1}
              >
                <ChevronRight className='w-6 h-6 text-gray-600' />
              </button>
            </div>
          )}
        </Document>
      </div>

      <div className='mt-8 text-sm text-gray-500 font-medium'>
        Page {currentPage + 1} of {numPages}
      </div>
    </div>
  );
}
