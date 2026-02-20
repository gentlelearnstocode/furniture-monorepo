import { EntityBase, LocalizedFields } from './common';

export interface ShowcaseImage {
  url: string;
  assetId: string;
  isPrimary?: boolean;
  focusPoint?: { x: number; y: number } | null;
}

export interface GeneralPageContent {
  header?: {
    introHtml?: string;
    introHtmlVi?: string | null;
    buttonText?: string;
    buttonTextVi?: string | null;
    buttonLink?: string;
    button2Text?: string;
    button2TextVi?: string | null;
    button2Link?: string;
    images?: ShowcaseImage[];
  };
  body?: {
    images?: ShowcaseImage[];
    introHtml?: string;
    introHtmlVi?: string | null;
    paragraphHtml?: string;
    paragraphHtmlVi?: string | null;
  };
  footer?: {
    imageUrl?: string | null;
    imageId?: string | null;
    textHtml?: string;
    textHtmlVi?: string | null;
  };
  bannerId?: string | null;
  bannerUrl?: string | null;
  pdfId?: string | null;
  pdfUrl?: string | null;
}

export interface CustomPage extends EntityBase, LocalizedFields {
  slug: string;
  title: string;
  content: GeneralPageContent; // Use structured type
  isActive: boolean;
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
