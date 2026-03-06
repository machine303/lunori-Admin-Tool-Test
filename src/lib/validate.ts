import { GlossaryEntry, QAWarning } from './types';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getQAWarnings(entry: GlossaryEntry): QAWarning[] {
  const warnings: QAWarning[] = [];

  if (!entry.title || entry.title.trim() === '') {
    warnings.push({ type: 'title', message: 'Title is missing' });
  }

  if (!entry.slug || entry.slug.trim() === '') {
    warnings.push({ type: 'slug', message: 'Slug is missing' });
  }

  if (!entry.tags || entry.tags.trim() === '') {
    warnings.push({ type: 'tags', message: 'Tags are empty' });
  }

  if (entry.short && entry.short.length > 160) {
    warnings.push({ type: 'short', message: `Short description exceeds 160 chars (${entry.short.length})` });
  }

  return warnings;
}

export function validateEntry(entry: Partial<GlossaryEntry>): string[] {
  const errors: string[] = [];

  if (!entry.id) {
    errors.push('ID is required');
  }

  if (entry.status && !['active', 'draft', 'archived', 'deprecated'].includes(entry.status)) {
    errors.push(`Invalid status: ${entry.status}`);
  }

  return errors;
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function parseCommaSeparated(value: string): string[] {
  if (!value || value.trim() === '') return [];
  return value.split(',').map(s => s.trim()).filter(s => s !== '');
}

export function formatCommaSeparated(arr: string[]): string {
  return arr.filter(s => s.trim() !== '').join(', ');
}
