import { useState, useMemo } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { GlossaryEntry, FindReplaceConfig } from '../lib/types';
import { getTodayISO } from '../lib/validate';

interface FindReplaceProps {
  entries: GlossaryEntry[];
  onApply: (updatedEntries: GlossaryEntry[]) => void;
  onClose: () => void;
}

const defaultConfig: FindReplaceConfig = {
  find: '',
  replace: '',
  fields: {
    title: true,
    short: true,
    long: true,
    tags: true,
    synonyms: true,
  },
  caseSensitive: false,
};

export default function FindReplace({ entries, onApply, onClose }: FindReplaceProps) {
  const [config, setConfig] = useState<FindReplaceConfig>(defaultConfig);

  const activeEntries = entries.filter(e => e.status !== 'deprecated');
  const deprecatedCount = entries.length - activeEntries.length;

  const matchCount = useMemo(() => {
    if (!config.find.trim()) return 0;

    let count = 0;
    const searchTerm = config.caseSensitive ? config.find : config.find.toLowerCase();

    activeEntries.forEach((entry) => {
      const fieldsToSearch: (keyof typeof config.fields)[] = ['title', 'short', 'long', 'tags', 'synonyms'];
      
      fieldsToSearch.forEach((field) => {
        if (config.fields[field]) {
          const value = entry[field] || '';
          const searchIn = config.caseSensitive ? value : value.toLowerCase();
          
          let idx = 0;
          while ((idx = searchIn.indexOf(searchTerm, idx)) !== -1) {
            count++;
            idx += searchTerm.length;
          }
        }
      });
    });

    return count;
  }, [config, activeEntries]);

  const handleFieldToggle = (field: keyof typeof config.fields) => {
    setConfig({
      ...config,
      fields: {
        ...config.fields,
        [field]: !config.fields[field],
      },
    });
  };

  const handleApply = () => {
    if (!config.find.trim()) return;

    const today = getTodayISO();
    const updated = entries.map((entry) => {
      if (entry.status === 'deprecated') return entry;

      let changed = false;
      const newEntry = { ...entry };

      const fieldsToSearch: (keyof typeof config.fields)[] = ['title', 'short', 'long', 'tags', 'synonyms'];

      fieldsToSearch.forEach((field) => {
        if (config.fields[field]) {
          const value = entry[field] || '';
          let newValue: string;

          if (config.caseSensitive) {
            newValue = value.split(config.find).join(config.replace);
          } else {
            const regex = new RegExp(escapeRegex(config.find), 'gi');
            newValue = value.replace(regex, config.replace);
          }

          if (newValue !== value) {
            (newEntry as Record<string, string>)[field] = newValue;
            changed = true;
          }
        }
      });

      if (changed) {
        newEntry.updated_at = today;
      }

      return newEntry;
    });

    onApply(updated);
    onClose();
  };

  const hasSelectedFields = Object.values(config.fields).some(Boolean);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Find & Replace</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
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

          <div className="find-replace-form">
            <div className="find-replace-row">
              <label className="form-label">Find</label>
              <input
                type="text"
                className="form-input"
                value={config.find}
                onChange={(e) => setConfig({ ...config, find: e.target.value })}
                placeholder="Text to find..."
                autoFocus
              />
            </div>

            <div className="find-replace-row">
              <label className="form-label">Replace with</label>
              <input
                type="text"
                className="form-input"
                value={config.replace}
                onChange={(e) => setConfig({ ...config, replace: e.target.value })}
                placeholder="Replacement text (leave empty to delete)..."
              />
            </div>

            <div className="find-replace-row">
              <label className="form-label">Search in fields</label>
              <div className="checkbox-group">
                {(['title', 'short', 'long', 'tags', 'synonyms'] as const).map((field) => (
                  <label key={field} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={config.fields[field]}
                      onChange={() => handleFieldToggle(field)}
                    />
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="find-replace-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={config.caseSensitive}
                  onChange={(e) => setConfig({ ...config, caseSensitive: e.target.checked })}
                />
                Case sensitive
              </label>
            </div>

            {config.find.trim() && (
              <div className="replace-preview">
                Found <span className="replace-count">{matchCount}</span> matches in {activeEntries.length} active entries
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleApply}
            disabled={!config.find.trim() || !hasSelectedFields || matchCount === 0}
          >
            Replace All ({matchCount})
          </button>
        </div>
      </div>
    </div>
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
