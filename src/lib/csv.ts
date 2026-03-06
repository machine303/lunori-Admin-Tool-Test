import Papa from 'papaparse';
import { GlossaryEntry, CSV_HEADERS, EntryStatus } from './types';

export interface ParseResult {
  entries: GlossaryEntry[];
  errors: string[];
  duplicateIds: string[];
}

export function parseCSV(csvText: string): ParseResult {
  const errors: string[] = [];
  const duplicateIds: string[] = [];
  const seenIds = new Set<string>();

  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase(),
  });

  if (result.errors.length > 0) {
    result.errors.forEach((err) => {
      errors.push(`Row ${err.row}: ${err.message}`);
    });
  }

  const entries: GlossaryEntry[] = [];

  result.data.forEach((row, index) => {
    const id = (row.id || '').trim();
    
    if (!id) {
      errors.push(`Row ${index + 2}: Missing ID`);
      return;
    }

    if (seenIds.has(id)) {
      duplicateIds.push(id);
    } else {
      seenIds.add(id);
    }

    const status = (row.status || 'draft').trim().toLowerCase();
    const validStatuses: EntryStatus[] = ['active', 'draft', 'archived', 'deprecated'];
    const finalStatus: EntryStatus = validStatuses.includes(status as EntryStatus) 
      ? (status as EntryStatus) 
      : 'draft';

    const entry: GlossaryEntry = {
      id,
      slug: (row.slug || '').trim(),
      url: (row.url || '').trim(),
      title: (row.title || '').trim(),
      short: (row.short || '').trim(),
      long: (row.long || '').trim(),
      level: (row.level || '').trim(),
      visibility: (row.visibility || '').trim(),
      category: (row.category || '').trim(),
      tags: (row.tags || '').trim(),
      app_priority: (row.app_priority || '').trim(),
      status: finalStatus,
      updated_at: (row.updated_at || '').trim(),
      synonyms: (row.synonyms || '').trim(),
      sources: (row.sources || '').trim(),
      notes: (row.notes || '').trim(),
    };

    entries.push(entry);
  });

  return { entries, errors, duplicateIds };
}

export function entriesToCSV(entries: GlossaryEntry[]): string {
  const data = entries.map((entry) => {
    const row: Record<string, string> = {};
    CSV_HEADERS.forEach((header) => {
      row[header] = entry[header] || '';
    });
    return row;
  });

  return Papa.unparse(data, {
    columns: [...CSV_HEADERS],
    quotes: true,
    quoteChar: '"',
    escapeChar: '"',
    newline: '\n',
  });
}
