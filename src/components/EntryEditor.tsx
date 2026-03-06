import { Lock, FileText, ArrowLeft } from 'lucide-react';
import { GlossaryEntry } from '../lib/types';
import { generateSlug, getTodayISO } from '../lib/validate';

interface EntryEditorProps {
  entry: GlossaryEntry | null;
  onUpdate: (entry: GlossaryEntry) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

function parseTags(tagStr: string): string[] {
  if (!tagStr) return [];
  return tagStr.split(',').map(t => t.trim()).filter(Boolean);
}

export default function EntryEditor({ entry, onUpdate, onBack, showBackButton }: EntryEditorProps) {
  if (!entry) {
    return (
      <div className="editor-empty">
        <FileText size={64} className="editor-empty-icon" />
        <p>Select an entry to edit</p>
      </div>
    );
  }

  const isDeprecated = entry.status === 'deprecated';
  const shortLength = entry.short?.length || 0;
  const tagPills = parseTags(entry.tags);

  const handleChange = (field: keyof GlossaryEntry, value: string) => {
    const updated = { ...entry, [field]: value, updated_at: getTodayISO() };

    // Auto-generate slug if title changes and slug is empty
    if (field === 'title' && !entry.slug) {
      updated.slug = generateSlug(value);
    }

    onUpdate(updated);
  };

  const handleStatusChange = (value: string) => {
    // Cannot change status if deprecated
    if (isDeprecated) return;
    handleChange('status', value);
  };

  const handleGenerateSlug = () => {
    if (entry.title) {
      handleChange('slug', generateSlug(entry.title));
    }
  };

  const getCharCounterClass = () => {
    if (shortLength > 160) return 'char-counter error';
    if (shortLength > 140) return 'char-counter warning';
    return 'char-counter';
  };

  return (
    <div className="editor-container">
      {showBackButton && (
        <button className="btn btn-ghost mobile-back-btn" onClick={onBack} style={{ marginBottom: '16px' }}>
          <ArrowLeft size={16} />
          Back to list
        </button>
      )}

      <div className="editor-header">
        <h2 className="editor-title">
          {entry.title || 'Untitled Entry'}
        </h2>
      </div>

      {isDeprecated && (
        <div className="deprecated-banner">
          <Lock size={18} />
          <span>Dieser Eintrag ist veraltet. Status ist gesperrt und kann nicht ge&auml;ndert werden.</span>
        </div>
      )}

      <div className="editor-form">
        {/* Row: ID + Status */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">ID (Read-only)</label>
            <input
              type="text"
              className="form-input readonly"
              value={entry.id}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={entry.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isDeprecated}
            >
              <option value="active">active</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
              <option
                value="deprecated"
                disabled={!isDeprecated}
                style={{ opacity: 0.5 }}
              >
                deprecated (gesperrt)
              </option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            value={entry.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter title..."
          />
        </div>

        {/* Slug */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">Slug</label>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleGenerateSlug}
              type="button"
            >
              Generate from title
            </button>
          </div>
          <input
            type="text"
            className="form-input"
            value={entry.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="url-friendly-slug"
          />
        </div>

        {/* URL */}
        <div className="form-group">
          <label className="form-label">URL</label>
          <input
            type="text"
            className="form-input"
            value={entry.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Short Description */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">Short Description</label>
            <span className={getCharCounterClass()}>
              {shortLength} / 160
            </span>
          </div>
          <textarea
            className={`form-input ${shortLength > 160 ? 'error' : ''}`}
            value={entry.short}
            onChange={(e) => handleChange('short', e.target.value)}
            placeholder="Brief description (max 160 characters recommended)..."
            rows={3}
          />
        </div>

        {/* Long Description */}
        <div className="form-group">
          <label className="form-label">Long Description</label>
          <textarea
            className="form-input tall"
            value={entry.long}
            onChange={(e) => handleChange('long', e.target.value)}
            placeholder="Detailed description..."
            rows={8}
          />
        </div>

        {/* Row: Category + Level */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={entry.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="">— select —</option>
              <option value="trading">trading</option>
              <option value="grundlagen">grundlagen</option>
              <option value="krypto">krypto</option>
              <option value="psychologie">psychologie</option>
              <option value="wirtschaft">wirtschaft</option>
              <option value="sonstiges">sonstiges</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Level</label>
            <select
              className="form-input"
              value={entry.level}
              onChange={(e) => handleChange('level', e.target.value)}
            >
              <option value="">— select —</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

        {/* Row: Visibility + App Priority */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Visibility</label>
            <select
              className="form-input"
              value={entry.visibility}
              onChange={(e) => handleChange('visibility', e.target.value)}
            >
              <option value="">— select —</option>
              <option value="public">public</option>
              <option value="private">private</option>
              <option value="hidden">hidden</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">App Priority</label>
            <select
              className="form-input"
              value={entry.app_priority}
              onChange={(e) => handleChange('app_priority', e.target.value)}
            >
              <option value="">— select —</option>
              <option value="must">must</option>
              <option value="should">should</option>
              <option value="optional">optional</option>
              <option value="skip">skip</option>
            </select>
          </div>
        </div>

        {/* Tags — pills display + editable input */}
        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          {tagPills.length > 0 && (
            <div className="editor-tag-pills">
              {tagPills.map((tag, i) => (
                <span key={i} className="tag-pill">{tag}</span>
              ))}
            </div>
          )}
          <input
            type="text"
            className="form-input"
            value={entry.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="tag1, tag2, tag3..."
          />
          <span className="form-help">Separate multiple tags with commas</span>
        </div>

        {/* Synonyms */}
        <div className="form-group">
          <label className="form-label">Synonyms (comma-separated)</label>
          <input
            type="text"
            className="form-input"
            value={entry.synonyms}
            onChange={(e) => handleChange('synonyms', e.target.value)}
            placeholder="z.B. BBands, Bollinger"
          />
        </div>

        {/* Sources */}
        <div className="form-group">
          <label className="form-label">Sources (comma-separated)</label>
          <textarea
            className="form-input"
            value={entry.sources}
            onChange={(e) => handleChange('sources', e.target.value)}
            placeholder="https://source1.com, https://source2.com..."
            rows={2}
          />
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-input"
            value={entry.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Internal notes..."
            rows={3}
          />
        </div>

        {/* Updated At */}
        <div className="form-group">
          <label className="form-label">Updated At</label>
          <input
            type="text"
            className="form-input readonly"
            value={entry.updated_at}
            disabled
          />
          <span className="form-help">Auto-updated when you make changes</span>
        </div>
      </div>
    </div>
  );
}
