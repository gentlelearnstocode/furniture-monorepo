import { EntityBase, LocalizedFields } from './common';

export interface CustomPage extends EntityBase, LocalizedFields {
  slug: string;
  title: string;
  content: unknown; // Base type, can be narrowed for specific pages
  isActive: boolean;
}

export interface ShowcaseImage {
  url: string;
  assetId?: string;
  isPrimary?: boolean;
  focusPoint?: { x: number; y: number } | null;
}

export interface ExportsPageContent {
  header: {
    introHtml: string;
    introHtmlVi?: string | null;
  };
  body: {
    images: ShowcaseImage[];
    introHtml: string;
    introHtmlVi?: string | null;
    paragraphHtml: string;
    paragraphHtmlVi?: string | null;
  };
  footer: {
    imageUrl?: string | null;
    textHtml: string;
    textHtmlVi?: string | null;
  };
}

export interface ShowroomPageContent {
  header: {
    introHtml: string;
    introHtmlVi?: string | null;
    images: ShowcaseImage[];
  };
}

export interface AboutUsPageContent {
  bannerUrl?: string;
  pdfUrl?: string;
  body?: {
    paragraphHtml?: string;
    paragraphHtmlVi?: string;
  };
}
