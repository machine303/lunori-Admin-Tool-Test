import { Lock, FileText, ArrowLeft } from 'lucide-react';
import { GlossaryEntry, EntryStatus } from '../lib/types';
import { generateSlug, getTodayISO } from '../lib/validate';

interface EntryEditorProps {
  entry: GlossaryEntry | null;
  onUpdate: (entry: GlossaryEntry) => void;
  onBack?: () => void;
  showBackButton?: boolean;
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
          <span>This entry is deprecated. Status is locked and cannot be changed.</span>
        </div>
      )}

      <div className="editor-form">
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
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>
        </div>

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

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-input"
              value={entry.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., Banking, Investment..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Level</label>
            <input
              type="text"
              className="form-input"
              value={entry.level}
              onChange={(e) => handleChange('level', e.target.value)}
              placeholder="e.g., beginner, advanced..."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Visibility</label>
            <input
              type="text"
              className="form-input"
              value={entry.visibility}
              onChange={(e) => handleChange('visibility', e.target.value)}
              placeholder="e.g., public, internal..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">App Priority</label>
            <input
              type="text"
              className="form-input"
              value={entry.app_priority}
              onChange={(e) => handleChange('app_priority', e.target.value)}
              placeholder="e.g., high, medium, low..."
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            className="form-input"
            value={entry.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="tag1, tag2, tag3..."
          />
          <span className="form-help">Separate multiple tags with commas</span>
        </div>

        <div className="form-group">
          <label className="form-label">Synonyms (comma-separated)</label>
          <input
            type="text"
            className="form-input"
            value={entry.synonyms}
            onChange={(e) => handleChange('synonyms', e.target.value)}
            placeholder="synonym1, synonym2..."
          />
        </div>

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
