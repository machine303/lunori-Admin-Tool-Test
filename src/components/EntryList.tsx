import { AlertTriangle, Lock } from 'lucide-react';
import { GlossaryEntry, QAWarning } from '../lib/types';
import { getQAWarnings } from '../lib/validate';

interface EntryListProps {
  entries: GlossaryEntry[];
  selectedId: string | null;
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  allSelected: boolean;
}

export default function EntryList({
  entries,
  selectedId,
  selectedIds,
  onSelect,
  onToggleSelect,
  onSelectAll,
  allSelected,
}: EntryListProps) {
  const selectableEntries = entries.filter(e => e.status !== 'deprecated');

  return (
    <>
      <div className="entry-list-header">
        <label className="select-all-checkbox">
          <input
            type="checkbox"
            checked={allSelected && selectableEntries.length > 0}
            onChange={onSelectAll}
            disabled={selectableEntries.length === 0}
          />
          <span>{selectedIds.size} selected</span>
        </label>
        <span>{entries.length} entries</span>
      </div>

      <div className="entry-list-container">
        <ul className="entry-list">
          {entries.map((entry) => {
            const warnings = getQAWarnings(entry);
            const isActive = selectedId === entry.id;
            const isChecked = selectedIds.has(entry.id);
            const isDeprecated = entry.status === 'deprecated';

            return (
              <li
                key={entry.id}
                className={`entry-item ${isActive ? 'active' : ''} ${isChecked ? 'selected' : ''}`}
                onClick={() => onSelect(entry.id)}
              >
                <div className="entry-checkbox" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isDeprecated}
                    onChange={() => onToggleSelect(entry.id)}
                  />
                </div>

                <div className="entry-content">
                  <div className="entry-header">
                    <span className="entry-title">
                      {entry.title || <em style={{ color: 'var(--text-muted)' }}>Untitled</em>}
                    </span>
                    <span className="entry-id">{entry.id}</span>
                    {isDeprecated && <Lock size={12} style={{ color: 'var(--status-deprecated)' }} />}
                  </div>

                  {entry.short && (
                    <p className="entry-short">{entry.short}</p>
                  )}

                  <div className="entry-meta">
                    <span className={`status-badge status-${entry.status}`}>
                      {entry.status}
                    </span>
                    
                    {entry.category && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {entry.category}
                      </span>
                    )}

                    {warnings.length > 0 && (
                      <div className="qa-warnings">
                        {warnings.map((w, i) => (
                          <span
                            key={i}
                            className={`qa-warning ${w.type === 'short' ? 'error' : ''}`}
                            title={w.message}
                          >
                            <AlertTriangle size={12} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
