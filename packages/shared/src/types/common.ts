/**
 * Base localized fields that can be optionally present on entities.
 */
export interface LocalizedFields {
  nameVi?: string | null;
  descriptionVi?: string | null;
  shortDescriptionVi?: string | null;
  titleVi?: string | null;
}

/**
 * Common metadata fields present on most database-backed entities.
 */
export interface EntityBase {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
