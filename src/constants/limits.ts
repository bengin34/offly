/**
 * App limits for free vs pro users
 */
export const APP_LIMITS = {
  FREE_MAX_CHAPTERS: 5,
  FREE_MAX_LETTERS_PER_VAULT: 2, // Per-vault letter limit on free plan
  FREE_MAX_PROFILES: 1,
  MAX_PHOTOS_PER_MEMORY: 10,
  BACKUP_REMINDER_CHAPTERS: 5, // Remind to backup after every 5 chapters (earlier for precious baby data)
} as const;

/**
 * Features that require Pro subscription
 */
export const PRO_FEATURES = {
  UNLIMITED_CHAPTERS: 'unlimited_chapters',
  JSON_EXPORT: 'json_export',
  XLS_EXPORT: 'xls_export',
  ZIP_EXPORT: 'zip_export',
  ADVANCED_SEARCH: 'advanced_search',
} as const;
