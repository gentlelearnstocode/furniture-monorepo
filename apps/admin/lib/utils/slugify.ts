/**
 * Converts a string into a URL-friendly slug, with special handling for Vietnamese characters.
 */
export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Separate characters from their diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[đĐ]/g, 'd') // Specifically handle the Vietnamese 'd'
    .replace(/[^a-z0-9\s-]/g, '') // Remove any remaining non-alphanumeric characters (except spaces and hyphens)
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}
