import {
  pgTable,
  text,
  boolean,
  timestamp,
  decimal,
  integer,
  uuid,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Media / Assets ---

export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type'),
  size: integer('size'), // in bytes
  altText: text('alt_text'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const assetsRelations = relations(assets, ({ many }) => ({
  productAssets: many(productAssets),
  variantAssets: many(variantAssets),
  catalogs: many(catalogs),
  collections: many(collections),
}));

import { AnyPgColumn } from 'drizzle-orm/pg-core';

export const catalogs = pgTable('catalogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  nameVi: text('name_vi'),
  slug: text('slug').notNull().unique(),
  parentId: uuid('parent_id').references((): AnyPgColumn => catalogs.id, { onDelete: 'cascade' }), // Self-referencing FK
  level: integer('level').notNull().default(1), // 1 = parent catalog, 2 = subcatalog
  imageId: uuid('image_id').references(() => assets.id, { onDelete: 'set null' }),
  description: text('description'),
  descriptionVi: text('description_vi'),
  showOnHome: boolean('show_on_home').default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  productImageRatio: text('product_image_ratio').default('4:5').notNull(),
  createdById: uuid('created_by_id').references((): AnyPgColumn => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const catalogsRelations = relations(catalogs, ({ one, many }) => ({
  parent: one(catalogs, {
    fields: [catalogs.parentId],
    references: [catalogs.id],
    relationName: 'catalog_parent',
  }),
  children: many(catalogs, { relationName: 'catalog_parent' }),
  products: many(products),
  collections: many(catalogCollections),
  image: one(assets, {
    fields: [catalogs.imageId],
    references: [assets.id],
  }),
  createdBy: one(users, {
    fields: [catalogs.createdById],
    references: [users.id],
  }),
}));

export const collections = pgTable('collections', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  nameVi: text('name_vi'),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  descriptionVi: text('description_vi'),
  bannerId: uuid('banner_id').references(() => assets.id),
  isActive: boolean('is_active').default(true).notNull(),
  createdById: uuid('created_by_id').references((): AnyPgColumn => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  banner: one(assets, {
    fields: [collections.bannerId],
    references: [assets.id],
  }),
  products: many(collectionProducts),
  catalogs: many(catalogCollections),
  createdBy: one(users, {
    fields: [collections.createdById],
    references: [users.id],
  }),
}));

// Join table for Collections <-> Products (Many-to-Many)
export const collectionProducts = pgTable(
  'collection_products',
  {
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.collectionId, t.productId] }),
  }),
);

export const collectionProductsRelations = relations(collectionProducts, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionProducts.collectionId],
    references: [collections.id],
  }),
  product: one(products, {
    fields: [collectionProducts.productId],
    references: [products.id],
  }),
}));

// Join table for Catalogs <-> Collections (Many-to-Many)
export const catalogCollections = pgTable(
  'catalog_collections',
  {
    catalogId: uuid('catalog_id')
      .notNull()
      .references(() => catalogs.id, { onDelete: 'cascade' }),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.catalogId, t.collectionId] }),
  }),
);

export const catalogCollectionsRelations = relations(catalogCollections, ({ one }) => ({
  catalog: one(catalogs, {
    fields: [catalogCollections.catalogId],
    references: [catalogs.id],
  }),
  collection: one(collections, {
    fields: [catalogCollections.collectionId],
    references: [collections.id],
  }),
}));

// --- Products ---

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  nameVi: text('name_vi'),
  slug: text('slug').notNull().unique(),
  catalogId: uuid('catalog_id').references(() => catalogs.id, { onDelete: 'set null' }),
  description: text('description'),
  descriptionVi: text('description_vi'),
  shortDescription: text('short_description'),
  shortDescriptionVi: text('short_description_vi'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal('discount_price', { precision: 10, scale: 2 }),
  showPrice: boolean('show_price').default(true).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  dimensions: jsonb('dimensions'), // { width, height, depth, unit }
  createdById: uuid('created_by_id').references((): AnyPgColumn => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  catalog: one(catalogs, {
    fields: [products.catalogId],
    references: [catalogs.id],
  }),
  variants: many(variants),
  gallery: many(productAssets),
  collections: many(collectionProducts),
  createdBy: one(users, {
    fields: [products.createdById],
    references: [users.id],
  }),
  recommendations: many(recommendedProducts, { relationName: 'product_recommendations' }),
  recommendedIn: many(recommendedProducts, { relationName: 'recommended_in' }),
}));

// --- Options & Variants ---

export const options = pgTable('options', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // e.g. "Color"
  nameVi: text('name_vi'),
  code: text('code').notNull().unique(), // e.g. "color"
});

export const optionsRelations = relations(options, ({ many }) => ({
  values: many(optionValues),
}));

export const optionValues = pgTable('option_values', {
  id: uuid('id').defaultRandom().primaryKey(),
  optionId: uuid('option_id')
    .notNull()
    .references(() => options.id, { onDelete: 'cascade' }),
  label: text('label').notNull(), // e.g. "Red"
  labelVi: text('label_vi'),
  value: text('value').notNull(), // e.g. "#FF0000" or "red"
  metadata: jsonb('metadata'), // { textureUrl: "..." }
});

export const optionValuesRelations = relations(optionValues, ({ one, many }) => ({
  option: one(options, {
    fields: [optionValues.optionId],
    references: [options.id],
  }),
  // Usage in variants via join table
  variantValues: many(variantOptionValues),
}));

export const variants = pgTable('variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  sku: text('sku').notNull().unique(),
  price: decimal('price', { precision: 10, scale: 2 }), // Override base price if present
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  optionValues: many(variantOptionValues),
  assets: many(variantAssets),
}));

export const variantOptionValues = pgTable(
  'variant_option_values',
  {
    variantId: uuid('variant_id')
      .notNull()
      .references(() => variants.id, { onDelete: 'cascade' }),
    optionValueId: uuid('option_value_id')
      .notNull()
      .references(() => optionValues.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.variantId, t.optionValueId] }),
  }),
);

export const variantOptionValuesRelations = relations(variantOptionValues, ({ one }) => ({
  variant: one(variants, {
    fields: [variantOptionValues.variantId],
    references: [variants.id],
  }),
  optionValue: one(optionValues, {
    fields: [variantOptionValues.optionValueId],
    references: [optionValues.id],
  }),
}));

// --- Asset Links ---

// Image display settings type definitions
export type FocusPoint = { x: number; y: number };
export type AspectRatio = 'original' | '1:1' | '3:4' | '4:3' | '16:9';
export type ObjectFit = 'cover' | 'contain';

export const productAssets = pgTable(
  'product_assets',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id')
      .notNull()
      .references(() => assets.id, { onDelete: 'cascade' }),
    position: integer('position').default(0).notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
    // Display settings for image customization
    focusPoint: jsonb('focus_point').$type<FocusPoint>(), // { x: 0-100, y: 0-100 } percentages from top-left
    aspectRatio: text('aspect_ratio').$type<AspectRatio>().default('original'),
    objectFit: text('object_fit').$type<ObjectFit>().default('cover'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.assetId] }),
  }),
);

export const productAssetsRelations = relations(productAssets, ({ one }) => ({
  product: one(products, {
    fields: [productAssets.productId],
    references: [products.id],
  }),
  asset: one(assets, {
    fields: [productAssets.assetId],
    references: [assets.id],
  }),
}));

export const variantAssets = pgTable(
  'variant_assets',
  {
    variantId: uuid('variant_id')
      .notNull()
      .references(() => variants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id')
      .notNull()
      .references(() => assets.id, { onDelete: 'cascade' }),
    position: integer('position').default(0).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.variantId, t.assetId] }),
  }),
);

export const variantAssetsRelations = relations(variantAssets, ({ one }) => ({
  variant: one(variants, {
    fields: [variantAssets.variantId],
    references: [variants.id],
  }),
  asset: one(assets, {
    fields: [variantAssets.assetId],
    references: [assets.id],
  }),
}));

// --- Authentication & Users ---

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  username: text('username').unique(),
  password: text('password'),
  role: text('role').$type<'admin' | 'editor'>().default('editor').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    pk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
);

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

export const verificationTokens = pgTable(
  'verification_token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires').notNull(),
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// --- Site Settings ---

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- Store Intro ---

export const siteIntros = pgTable('site_intros', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  titleVi: text('title_vi'),
  subtitle: text('subtitle'),
  subtitleVi: text('subtitle_vi'),
  contentHtml: text('content_html').notNull(),
  contentHtmlVi: text('content_html_vi'),
  introImageId: uuid('intro_image_id').references(() => assets.id),
  backgroundImageId: uuid('background_image_id').references(() => assets.id),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const siteIntrosRelations = relations(siteIntros, ({ one }) => ({
  introImage: one(assets, {
    fields: [siteIntros.introImageId],
    references: [assets.id],
  }),
  backgroundImage: one(assets, {
    fields: [siteIntros.backgroundImageId],
    references: [assets.id],
  }),
}));

// --- Site Hero ---

export const siteHeros = pgTable('site_heros', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title'),
  titleVi: text('title_vi'),
  subtitle: text('subtitle'),
  subtitleVi: text('subtitle_vi'),
  buttonText: text('button_text'),
  buttonTextVi: text('button_text_vi'),
  buttonLink: text('button_link'),
  backgroundType: text('background_type').$type<'image' | 'video'>().default('image').notNull(),
  backgroundImageId: uuid('background_image_id').references(() => assets.id),
  backgroundVideoId: uuid('background_video_id').references(() => assets.id),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const siteHerosRelations = relations(siteHeros, ({ one }) => ({
  backgroundImage: one(assets, {
    fields: [siteHeros.backgroundImageId],
    references: [assets.id],
  }),
  backgroundVideo: one(assets, {
    fields: [siteHeros.backgroundVideoId],
    references: [assets.id],
  }),
}));

// --- Services ---

export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  titleVi: text('title_vi'),
  slug: text('slug').notNull().unique(),
  descriptionHtml: text('description_html').notNull(),
  descriptionHtmlVi: text('description_html_vi'),
  imageId: uuid('image_id').references(() => assets.id),
  isActive: boolean('is_active').default(true).notNull(),
  seoTitle: text('seo_title'),
  seoTitleVi: text('seo_title_vi'),
  seoDescription: text('seo_description'),
  seoDescriptionVi: text('seo_description_vi'),
  seoKeywords: text('seo_keywords'),
  seoKeywordsVi: text('seo_keywords_vi'),
  createdById: uuid('created_by_id').references((): AnyPgColumn => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const servicesRelations = relations(services, ({ one, many }) => ({
  image: one(assets, {
    fields: [services.imageId],
    references: [assets.id],
  }),
  gallery: many(serviceAssets),
  createdBy: one(users, {
    fields: [services.createdById],
    references: [users.id],
  }),
}));

export const serviceAssets = pgTable(
  'service_assets',
  {
    serviceId: uuid('service_id')
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id')
      .notNull()
      .references(() => assets.id, { onDelete: 'cascade' }),
    position: integer('position').default(0).notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.serviceId, t.assetId] }),
  }),
);

export const serviceAssetsRelations = relations(serviceAssets, ({ one }) => ({
  service: one(services, {
    fields: [serviceAssets.serviceId],
    references: [services.id],
  }),
  asset: one(assets, {
    fields: [serviceAssets.assetId],
    references: [assets.id],
  }),
}));

// --- Projects ---

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  titleVi: text('title_vi'),
  slug: text('slug').notNull().unique(),
  contentHtml: text('content_html').notNull(),
  contentHtmlVi: text('content_html_vi'),
  imageId: uuid('image_id').references(() => assets.id),
  isActive: boolean('is_active').default(true).notNull(),
  seoTitle: text('seo_title'),
  seoTitleVi: text('seo_title_vi'),
  seoDescription: text('seo_description'),
  seoDescriptionVi: text('seo_description_vi'),
  seoKeywords: text('seo_keywords'),
  seoKeywordsVi: text('seo_keywords_vi'),
  createdById: uuid('created_by_id').references((): AnyPgColumn => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  image: one(assets, {
    fields: [projects.imageId],
    references: [assets.id],
  }),
  gallery: many(projectAssets),
  createdBy: one(users, {
    fields: [projects.createdById],
    references: [users.id],
  }),
}));

export const projectAssets = pgTable(
  'project_assets',
  {
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id')
      .notNull()
      .references(() => assets.id, { onDelete: 'cascade' }),
    position: integer('position').default(0).notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.projectId, t.assetId] }),
  }),
);

export const projectAssetsRelations = relations(projectAssets, ({ one }) => ({
  project: one(projects, {
    fields: [projectAssets.projectId],
    references: [projects.id],
  }),
  asset: one(assets, {
    fields: [projectAssets.assetId],
    references: [assets.id],
  }),
}));

// --- Blog Posts ---

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  titleVi: text('title_vi'),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  excerptVi: text('excerpt_vi'),
  contentHtml: text('content_html').notNull(),
  contentHtmlVi: text('content_html_vi'),
  featuredImageId: uuid('featured_image_id').references(() => assets.id),
  isActive: boolean('is_active').default(true).notNull(),
  seoTitle: text('seo_title'),
  seoTitleVi: text('seo_title_vi'),
  seoDescription: text('seo_description'),
  seoDescriptionVi: text('seo_description_vi'),
  seoKeywords: text('seo_keywords'),
  seoKeywordsVi: text('seo_keywords_vi'),
  createdById: uuid('created_by_id').references((): AnyPgColumn => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  featuredImage: one(assets, {
    fields: [posts.featuredImageId],
    references: [assets.id],
  }),
  gallery: many(postAssets),
  createdBy: one(users, {
    fields: [posts.createdById],
    references: [users.id],
  }),
}));

export const postAssets = pgTable(
  'post_assets',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id')
      .notNull()
      .references(() => assets.id, { onDelete: 'cascade' }),
    position: integer('position').default(0).notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.assetId] }),
  }),
);

export const postAssetsRelations = relations(postAssets, ({ one }) => ({
  post: one(posts, {
    fields: [postAssets.postId],
    references: [posts.id],
  }),
  asset: one(assets, {
    fields: [postAssets.assetId],
    references: [assets.id],
  }),
}));

// --- Site Footer Settings ---

export const siteFooter = pgTable('site_footer', {
  id: uuid('id').defaultRandom().primaryKey(),
  intro: text('intro').notNull(),
  introVi: text('intro_vi'),
  description: text('description'),
  descriptionVi: text('description_vi'),
  mapEmbedUrl: text('map_embed_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const footerAddresses = pgTable('footer_addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  label: text('label').notNull(),
  labelVi: text('label_vi'),
  address: text('address').notNull(),
  addressVi: text('address_vi'),
  position: integer('position').default(0).notNull(),
});

export const footerContacts = pgTable('footer_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: text('type').$type<'phone' | 'email'>().notNull(),
  label: text('label'),
  labelVi: text('label_vi'),
  value: text('value').notNull(),
  position: integer('position').default(0).notNull(),
});

export const footerSocialLinks = pgTable('footer_social_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  platform: text('platform')
    .$type<'facebook' | 'instagram' | 'youtube' | 'zalo' | 'tiktok' | 'linkedin' | 'twitter'>()
    .notNull(),
  url: text('url').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  position: integer('position').default(0).notNull(),
});

// --- Site Contacts (Site-wide contact points) ---

export const siteContacts = pgTable('site_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: text('type')
    .$type<'phone' | 'zalo' | 'facebook' | 'messenger' | 'email' | 'whatsapp'>()
    .notNull(),
  label: text('label'),
  value: text('value').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  position: integer('position').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type InsertSiteContact = typeof siteContacts.$inferInsert;
export type SelectSiteContact = typeof siteContacts.$inferSelect;

// --- Featured Catalog Layout ---

export const featuredCatalogRows = pgTable('featured_catalog_rows', {
  id: uuid('id').defaultRandom().primaryKey(),
  position: integer('position').notNull().default(0), // Row order (0, 1, 2...)
  columns: integer('columns').notNull().default(1), // 1-4 catalogs per row
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const featuredCatalogRowsRelations = relations(featuredCatalogRows, ({ many }) => ({
  items: many(featuredCatalogRowItems),
}));

export const featuredCatalogRowItems = pgTable('featured_catalog_row_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  rowId: uuid('row_id')
    .notNull()
    .references(() => featuredCatalogRows.id, { onDelete: 'cascade' }),
  catalogId: uuid('catalog_id')
    .notNull()
    .references(() => catalogs.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0), // Position within row
});

export const featuredCatalogRowItemsRelations = relations(featuredCatalogRowItems, ({ one }) => ({
  row: one(featuredCatalogRows, {
    fields: [featuredCatalogRowItems.rowId],
    references: [featuredCatalogRows.id],
  }),
  catalog: one(catalogs, {
    fields: [featuredCatalogRowItems.catalogId],
    references: [catalogs.id],
  }),
}));

export type InsertFeaturedCatalogRow = typeof featuredCatalogRows.$inferInsert;
export type SelectFeaturedCatalogRow = typeof featuredCatalogRows.$inferSelect;

export type InsertFeaturedCatalogRowItem = typeof featuredCatalogRowItems.$inferInsert;
export type SelectFeaturedCatalogRowItem = typeof featuredCatalogRowItems.$inferSelect;

export type InsertSiteFooter = typeof siteFooter.$inferInsert;
export type SelectSiteFooter = typeof siteFooter.$inferSelect;

export type InsertFooterAddress = typeof footerAddresses.$inferInsert;
export type SelectFooterAddress = typeof footerAddresses.$inferSelect;

export type InsertFooterContact = typeof footerContacts.$inferInsert;
export type SelectFooterContact = typeof footerContacts.$inferSelect;

export type InsertFooterSocialLink = typeof footerSocialLinks.$inferInsert;
export type SelectFooterSocialLink = typeof footerSocialLinks.$inferSelect;

export type InsertSiteHero = typeof siteHeros.$inferInsert;
export type SelectSiteHero = typeof siteHeros.$inferSelect;

export type InsertSiteSetting = typeof siteSettings.$inferInsert;
export type SelectSiteSetting = typeof siteSettings.$inferSelect;

export type InsertProduct = typeof products.$inferInsert;
export type SelectProduct = typeof products.$inferSelect;

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

// --- Product Import Jobs ---

export const productImportJobs = pgTable('product_import_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: text('status')
    .$type<'pending' | 'processing' | 'completed' | 'failed'>()
    .default('pending')
    .notNull(),
  totalRows: integer('total_rows').default(0).notNull(),
  processedRows: integer('processed_rows').default(0).notNull(),
  successCount: integer('success_count').default(0).notNull(),
  errorCount: integer('error_count').default(0).notNull(),
  errors: jsonb('errors').$type<{ row: number; field: string; message: string }[]>(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export const productImportJobsRelations = relations(productImportJobs, ({ one }) => ({
  user: one(users, {
    fields: [productImportJobs.createdBy],
    references: [users.id],
  }),
}));

// --- Notifications ---

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // Recipient (null for broadcast)
  creatorId: uuid('creator_id').references(() => users.id, { onDelete: 'set null' }), // Who triggered it
  type: text('type')
    .$type<'entity_created' | 'entity_updated' | 'entity_deleted' | 'system'>()
    .notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: 'notification_recipient',
  }),
  creator: one(users, {
    fields: [notifications.creatorId],
    references: [users.id],
    relationName: 'notification_creator',
  }),
}));

export type InsertNotification = typeof notifications.$inferInsert;
export type SelectNotification = typeof notifications.$inferSelect;

export type InsertProductImportJob = typeof productImportJobs.$inferInsert;
export type SelectProductImportJob = typeof productImportJobs.$inferSelect;

// --- Sale Section ---

export const saleSectionSettings = pgTable('sale_section_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull().default('SALE'),
  titleVi: text('title_vi'),
  isActive: boolean('is_active').default(true).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const homepageSaleProducts = pgTable('homepage_sale_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  position: integer('position').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const homepageSaleProductsRelations = relations(homepageSaleProducts, ({ one }) => ({
  product: one(products, {
    fields: [homepageSaleProducts.productId],
    references: [products.id],
  }),
}));

export type InsertSaleSectionSettings = typeof saleSectionSettings.$inferInsert;
export type SelectSaleSectionSettings = typeof saleSectionSettings.$inferSelect;

export type InsertHomepageSaleProduct = typeof homepageSaleProducts.$inferInsert;
export type SelectHomepageSaleProduct = typeof homepageSaleProducts.$inferSelect;

// --- Nav Menu Items ---

export const navMenuItems = pgTable('nav_menu_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemType: text('item_type').$type<'catalog' | 'subcatalog' | 'service'>().notNull(),
  catalogId: uuid('catalog_id').references(() => catalogs.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }),
  position: integer('position').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const navMenuItemsRelations = relations(navMenuItems, ({ one }) => ({
  catalog: one(catalogs, {
    fields: [navMenuItems.catalogId],
    references: [catalogs.id],
  }),
  service: one(services, {
    fields: [navMenuItems.serviceId],
    references: [services.id],
  }),
}));

export type InsertNavMenuItem = typeof navMenuItems.$inferInsert;
export type SelectNavMenuItem = typeof navMenuItems.$inferSelect;

// --- Recommended Products ---

export const recommendedProducts = pgTable(
  'recommended_products',
  {
    sourceProductId: uuid('source_product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    recommendedProductId: uuid('recommended_product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    position: integer('position').default(0).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.sourceProductId, t.recommendedProductId] }),
  }),
);

export const recommendedProductsRelations = relations(recommendedProducts, ({ one }) => ({
  sourceProduct: one(products, {
    fields: [recommendedProducts.sourceProductId],
    references: [products.id],
    relationName: 'product_recommendations',
  }),
  recommendedProduct: one(products, {
    fields: [recommendedProducts.recommendedProductId],
    references: [products.id],
    relationName: 'recommended_in',
  }),
}));

export type InsertRecommendedProduct = typeof recommendedProducts.$inferInsert;
export type SelectRecommendedProduct = typeof recommendedProducts.$inferSelect;
