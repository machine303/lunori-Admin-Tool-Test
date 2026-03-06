import { GlossaryEntry } from './types';
import { entriesToCSV } from './csv';
import { parseCommaSeparated } from './validate';

export interface SeedEntry {
  id: string;
  slug: string;
  url: string;
  title: string;
  short: string;
  long: string;
  level: string;
  visibility: string;
  category: string;
  tags: string[];
  app_priority: string;
  status: string;
  updated_at: string;
  synonyms: string[];
  sources: string[];
  notes: string;
}

export function exportToCSV(entries: GlossaryEntry[]): void {
  const csv = entriesToCSV(entries);
  downloadFile(csv, 'glossary_master.csv', 'text/csv;charset=utf-8');
}

export function exportToSeedJSON(entries: GlossaryEntry[]): void {
  const seed: Record<string, SeedEntry> = {};

  entries.forEach((entry) => {
    seed[entry.id] = {
      id: entry.id,
      slug: entry.slug,
      url: entry.url,
      title: entry.title,
      short: entry.short,
      long: entry.long,
      level: entry.level,
      visibility: entry.visibility,
      category: entry.category,
      tags: parseCommaSeparated(entry.tags),
      app_priority: entry.app_priority,
      status: entry.status,
      updated_at: entry.updated_at,
      synonyms: parseCommaSeparated(entry.synonyms),
      sources: parseCommaSeparated(entry.sources),
      notes: entry.notes,
    };
  });

  const json = JSON.stringify(seed, null, 2);
  downloadFile(json, 'glossary_seed_v1.json', 'application/json');
}

export function exportToSlugIndex(entries: GlossaryEntry[]): void {
  const index: Record<string, string> = {};

  entries.forEach((entry) => {
    if (entry.slug && entry.slug.trim() !== '') {
      index[entry.slug] = entry.id;
    }
  });

  const json = JSON.stringify(index, null, 2);
  downloadFile(json, 'glossary_slug_index.json', 'application/json');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
