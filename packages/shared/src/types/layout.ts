import { Catalog } from './catalog';

export interface FeaturedCatalogItem {
  id: string;
  rowId: string;
  catalogId: string;
  position: number;
  catalog?: Catalog;
}

export interface FeaturedCatalogRow {
  id: string;
  position: number;
  columns: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  items: FeaturedCatalogItem[];
}

export interface SaleSectionSettings {
  id: string;
  title: string;
  titleVi?: string | null;
  isActive: boolean;
  updatedAt: Date | string;
}
