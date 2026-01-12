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
  slug: text('slug').notNull().unique(),
  parentId: uuid('parent_id').references((): AnyPgColumn => catalogs.id, { onDelete: 'cascade' }), // Self-referencing FK
  imageId: uuid('image_id').references(() => assets.id, { onDelete: 'set null' }),
  description: text('description'),
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
}));

export const collections = pgTable('collections', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  bannerId: uuid('banner_id').references(() => assets.id),
  isActive: boolean('is_active').default(true).notNull(),
  showOnHome: boolean('show_on_home').default(false).notNull(),
  homeLayout: text('home_layout').$type<'full' | 'half' | 'third'>().default('full').notNull(),
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
  })
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
  })
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
  slug: text('slug').notNull().unique(),
  catalogId: uuid('catalog_id').references(() => catalogs.id, { onDelete: 'set null' }),
  description: text('description'),
  shortDescription: text('short_description'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  dimensions: jsonb('dimensions'), // { width, height, depth, unit }
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
}));

// --- Options & Variants ---

export const options = pgTable('options', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // e.g. "Color"
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
  })
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
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.assetId] }),
  })
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
  })
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
  })
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
  })
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
  subtitle: text('subtitle'),
  contentHtml: text('content_html').notNull(),
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
  subtitle: text('subtitle'),
  buttonText: text('button_text'),
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

export type InsertSiteHero = typeof siteHeros.$inferInsert;
export type SelectSiteHero = typeof siteHeros.$inferSelect;

export type InsertSiteSetting = typeof siteSettings.$inferInsert;
export type SelectSiteSetting = typeof siteSettings.$inferSelect;

export type InsertProduct = typeof products.$inferInsert;
export type SelectProduct = typeof products.$inferSelect;

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
