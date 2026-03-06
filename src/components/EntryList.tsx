import { AlertTriangle, Lock } from 'lucide-react';
import { GlossaryEntry } from '../lib/types';
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

function parseTags(tagStr: string): string[] {
  if (!tagStr) return [];
  return tagStr.split(',').map(t => t.trim()).filter(Boolean);
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
        {entries.length === 0 ? (
          <div className="entry-list-empty">
            <svg
              width="160"
              height="100"
              viewBox="0 0 160 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Curved horizon line */}
              <path
                d="M10 82 Q80 74 150 82"
                stroke="var(--offwhite-muted)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Moon circle */}
              <circle
                cx="80"
                cy="42"
                r="14"
                stroke="var(--gold-dim)"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Cloud 1 (left) */}
              <path
                d="M20 70 Q24 63 31 65 Q34 58 43 60 Q49 58 51 65 Q55 64 55 70 Z"
                fill="none"
                stroke="var(--offwhite-muted)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Cloud 2 (right) */}
              <path
                d="M95 74 Q99 67 107 69 Q111 63 120 65 Q126 64 126 71 Q130 70 130 76 Z"
                fill="none"
                stroke="var(--offwhite-muted)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Cloud 3 (small, center-right) */}
              <path
                d="M60 78 Q62 74 67 75 Q69 72 74 73 Q77 72 77 76 Z"
                fill="none"
                stroke="var(--offwhite-muted)"
                strokeWidth="1.0"
                strokeLinejoin="round"
              />
            </svg>
            <p className="entry-list-empty-text">Noch keine Eintr&auml;ge</p>
            <p className="entry-list-empty-hint">Lade eine CSV-Datei &uuml;ber den Import-Button</p>
          </div>
        ) : (
          <ul className="entry-list">
            {entries.map((entry) => {
              const warnings = getQAWarnings(entry);
              const isActive = selectedId === entry.id;
              const isChecked = selectedIds.has(entry.id);
              const isDeprecated = entry.status === 'deprecated';
              const tags = parseTags(entry.tags);
              const visibleTags = tags.slice(0, 3);
              const extraTags = tags.length - visibleTags.length;

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
                        {entry.title || <em style={{ color: 'var(--offwhite-muted)' }}>Untitled</em>}
                      </span>
                      <span className="entry-id">{entry.id}</span>
                      {isDeprecated && <Lock size={12} style={{ color: 'var(--status-deprecated)' }} />}
                    </div>

                    {entry.short && (
                      <p className="entry-short">{entry.short}</p>
                    )}

                    {visibleTags.length > 0 && (
                      <div className="entry-tags">
                        {visibleTags.map((tag, i) => (
                          <span key={i} className="tag-pill">{tag}</span>
                        ))}
                        {extraTags > 0 && (
                          <span className="tag-pill-more">+{extraTags}</span>
                        )}
                      </div>
                    )}

                    <div className="entry-meta">
                      <span className={`status-badge status-${entry.status}`}>
                        {entry.status}
                      </span>

                      {entry.category && (
                        <span style={{ fontSize: '12px', color: 'var(--offwhite-muted)' }}>
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
        )}
      </div>
    </>
  );
}
