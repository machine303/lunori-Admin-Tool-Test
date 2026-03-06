export type EntryStatus = 'active' | 'draft' | 'archived' | 'deprecated';

export interface GlossaryEntry {
  id: string;
  slug: string;
  url: string;
  title: string;
  short: string;
  long: string;
  level: string;
  visibility: string;
  category: string;
  tags: string;
  app_priority: string;
  status: EntryStatus;
  updated_at: string;
  synonyms: string;
  sources: string;
  notes: string;
}

export interface QAWarning {
  type: 'title' | 'slug' | 'tags' | 'short';
  message: string;
}

export type SortOption = 'updated_desc' | 'updated_asc' | 'title_asc' | 'title_desc';

export interface FilterState {
  search: string;
  status: EntryStatus | 'all';
  category: string;
  sort: SortOption;
}

export interface BulkEditData {
  status?: EntryStatus;
  category?: string;
  addTags?: string;
}

export interface FindReplaceConfig {
  find: string;
  replace: string;
  fields: {
    title: boolean;
    short: boolean;
    long: boolean;
    tags: boolean;
    synonyms: boolean;
  };
  caseSensitive: boolean;
}

export const CSV_HEADERS = [
  'id',
  'slug',
  'url',
  'title',
  'short',
  'long',
  'level',
  'visibility',
  'category',
  'tags',
  'app_priority',
  'status',
  'updated_at',
  'synonyms',
  'sources',
  'notes',
] as const;

export type CSVHeader = typeof CSV_HEADERS[number];
