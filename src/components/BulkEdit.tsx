import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { GlossaryEntry, EntryStatus, BulkEditData } from '../lib/types';
import { getTodayISO, parseCommaSeparated, formatCommaSeparated } from '../lib/validate';

interface BulkEditProps {
  entries: GlossaryEntry[];
  selectedIds: Set<string>;
  categories: string[];
  onApply: (updatedEntries: GlossaryEntry[]) => void;
  onClose: () => void;
}

export default function BulkEdit({ entries, selectedIds, categories, onApply, onClose }: BulkEditProps) {
  const [bulkData, setBulkData] = useState<BulkEditData>({});
  const [addTags, setAddTags] = useState('');

  // Filter out deprecated entries
  const editableEntries = entries.filter(
    (e) => selectedIds.has(e.id) && e.status !== 'deprecated'
  );
  const deprecatedCount = entries.filter(
    (e) => selectedIds.has(e.id) && e.status === 'deprecated'
  ).length;

  const handleApply = () => {
    const today = getTodayISO();
    const updated = entries.map((entry) => {
      if (!selectedIds.has(entry.id) || entry.status === 'deprecated') {
        return entry;
      }

      const newEntry = { ...entry, updated_at: today };

      if (bulkData.status) {
        newEntry.status = bulkData.status;
      }

      if (bulkData.category !== undefined) {
        newEntry.category = bulkData.category;
      }

      if (addTags.trim()) {
        const existingTags = parseCommaSeparated(entry.tags);
        const newTags = parseCommaSeparated(addTags);
        const merged = [...new Set([...existingTags, ...newTags])];
        newEntry.tags = formatCommaSeparated(merged);
      }

      return newEntry;
    });

    onApply(updated);
    onClose();
  };

  const hasChanges = bulkData.status || bulkData.category !== undefined || addTags.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Bulk Edit</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Editing <strong>{editableEntries.length}</strong> entries
          </p>

          {deprecatedCount > 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '12px',
              background: '#fff3e0',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              color: 'var(--warning)'
            }}>
              <AlertCircle size={16} />
              <span>{deprecatedCount} deprecated entries will be skipped</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Set Status</label>
            <select
              className="form-input"
              value={bulkData.status || ''}
              onChange={(e) => setBulkData({ 
                ...bulkData, 
                status: e.target.value as EntryStatus || undefined 
              })}
            >
              <option value="">— Don't change —</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Set Category</label>
            <select
              className="form-input"
              value={bulkData.category ?? ''}
              onChange={(e) => setBulkData({ 
                ...bulkData, 
                category: e.target.value || undefined 
              })}
            >
              <option value="">— Don't change —</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              className="form-input"
              style={{ marginTop: '8px' }}
              placeholder="Or type a new category..."
              onChange={(e) => setBulkData({ ...bulkData, category: e.target.value || undefined })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Add Tags (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={addTags}
              onChange={(e) => setAddTags(e.target.value)}
              placeholder="tag1, tag2..."
            />
            <span className="form-help">These tags will be added to existing tags</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleApply}
            disabled={!hasChanges || editableEntries.length === 0}
          >
            Apply to {editableEntries.length} entries
          </button>
        </div>
      </div>
    </div>
  );
}
