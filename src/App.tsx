import { useState, useMemo, useCallback } from 'react';
import { Upload, Edit3, Search, X } from 'lucide-react';
import { GlossaryEntry, FilterState, SortOption } from './lib/types';
import { parseCSV } from './lib/csv';
import TopBar from './components/TopBar';
import Filters from './components/Filters';
import EntryList from './components/EntryList';
import EntryEditor from './components/EntryEditor';
import BulkEdit from './components/BulkEdit';
import FindReplace from './components/FindReplace';

const defaultFilters: FilterState = {
  search: '',
  status: 'all',
  category: '',
  sort: 'updated_desc',
};

export default function App() {
  // Core state
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  
  // Modal state
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  
  // Mobile state
  const [showEditor, setShowEditor] = useState(false);

  // Derived data
  const categories = useMemo(() => {
    const cats = new Set<string>();
    entries.forEach((e) => {
      if (e.category?.trim()) cats.add(e.category.trim());
    });
    return Array.from(cats).sort();
  }, [entries]);

  // Filtered and sorted entries
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Search filter
    if (filters.search.trim()) {
      const search = filters.search.toLowerCase();
      result = result.filter((e) => {
        const searchFields = [
          e.id,
          e.slug,
          e.title,
          e.short,
          e.long,
          e.tags,
          e.synonyms,
        ].join(' ').toLowerCase();
        return searchFields.includes(search);
      });
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((e) => e.status === filters.status);
    }

    // Category filter
    if (filters.category) {
      result = result.filter((e) => e.category === filters.category);
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'updated_desc':
          return (b.updated_at || '').localeCompare(a.updated_at || '');
        case 'updated_asc':
          return (a.updated_at || '').localeCompare(b.updated_at || '');
        case 'title_asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title_desc':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });

    return result;
  }, [entries, filters]);

  const selectedEntry = useMemo(() => {
    return entries.find((e) => e.id === selectedId) || null;
  }, [entries, selectedId]);

  // Check if all selectable entries are selected
  const allSelected = useMemo(() => {
    const selectable = filteredEntries.filter((e) => e.status !== 'deprecated');
    return selectable.length > 0 && selectable.every((e) => selectedIds.has(e.id));
  }, [filteredEntries, selectedIds]);

  // File import handler
  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { entries: parsed, errors, duplicateIds } = parseCSV(text);

      if (errors.length > 0) {
        alert(`Import warnings:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n...and ${errors.length - 5} more` : ''}`);
      }

      if (duplicateIds.length > 0) {
        alert(`Duplicate IDs found: ${duplicateIds.join(', ')}`);
      }

      setEntries(parsed);
      setSelectedId(null);
      setSelectedIds(new Set());
      setFilters(defaultFilters);
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  }, []);

  // Entry selection handlers
  const handleSelectEntry = useCallback((id: string) => {
    setSelectedId(id);
    setShowEditor(true);
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry?.status === 'deprecated') return;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [entries]);

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      const selectable = filteredEntries
        .filter((e) => e.status !== 'deprecated')
        .map((e) => e.id);
      setSelectedIds(new Set(selectable));
    }
  }, [allSelected, filteredEntries]);

  // Entry update handler (auto-save)
  const handleUpdateEntry = useCallback((updated: GlossaryEntry) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  }, []);

  // Bulk operations
  const handleBulkApply = useCallback((updated: GlossaryEntry[]) => {
    setEntries(updated);
    setSelectedIds(new Set());
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Mobile back handler
  const handleBack = useCallback(() => {
    setShowEditor(false);
  }, []);

  // Welcome screen (no data loaded)
  if (entries.length === 0) {
    return (
      <div className="app-container">
        <TopBar entries={[]} hasData={false} />
        <div className="welcome-screen">
          <Upload size={64} className="welcome-logo" />
          <h2 className="welcome-title">Lunori Glossary Admin</h2>
          <p className="welcome-subtitle">
            Import your glossary CSV file to start editing entries, managing tags, 
            and exporting data.
          </p>
          
          <label className="import-dropzone">
            <input
              type="file"
              accept=".csv"
              className="import-input"
              onChange={handleFileImport}
            />
            <Upload size={32} className="import-dropzone-icon" />
            <span className="import-dropzone-text">
              Click to upload or drag & drop
            </span>
            <span className="import-dropzone-hint">
              glossary_master.csv
            </span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <TopBar entries={entries} hasData={true} />
      
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-actions-info">
            <span>{selectedIds.size} entries selected</span>
            <button className="btn btn-ghost btn-sm" onClick={handleClearSelection}>
              <X size={14} />
              Clear
            </button>
          </div>
          <div className="bulk-actions-buttons">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowFindReplace(true)}>
              <Search size={14} />
              Find & Replace
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setShowBulkEdit(true)}>
              <Edit3 size={14} />
              Bulk Edit
            </button>
          </div>
        </div>
      )}

      <main className="main-content">
        {/* List Panel */}
        <aside className={`list-panel ${showEditor ? 'hidden-mobile' : ''}`}>
          <Filters
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
          />
          <EntryList
            entries={filteredEntries}
            selectedId={selectedId}
            selectedIds={selectedIds}
            onSelect={handleSelectEntry}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            allSelected={allSelected}
          />
        </aside>

        {/* Editor Panel */}
        <section className={`editor-panel ${showEditor ? 'show-mobile' : 'hidden-mobile'}`}>
          <EntryEditor
            entry={selectedEntry}
            onUpdate={handleUpdateEntry}
            onBack={handleBack}
            showBackButton={showEditor}
          />
        </section>
      </main>

      {/* Modals */}
      {showBulkEdit && (
        <BulkEdit
          entries={entries}
          selectedIds={selectedIds}
          categories={categories}
          onApply={handleBulkApply}
          onClose={() => setShowBulkEdit(false)}
        />
      )}

      {showFindReplace && (
        <FindReplace
          entries={entries}
          onApply={handleBulkApply}
          onClose={() => setShowFindReplace(false)}
        />
      )}
    </div>
  );
}
