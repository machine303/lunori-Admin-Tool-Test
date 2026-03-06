import { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  ChevronDown,
  FileSpreadsheet,
  FileJson,
  Link2
} from 'lucide-react';
import { GlossaryEntry } from '../lib/types';
import { exportToCSV, exportToSeedJSON, exportToSlugIndex } from '../lib/exporters';

interface TopBarProps {
  entries: GlossaryEntry[];
  hasData: boolean;
}

export default function TopBar({ entries, hasData }: TopBarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const activeCount = entries.filter(e => e.status === 'active').length;
  const draftCount = entries.filter(e => e.status === 'draft').length;
  const deprecatedCount = entries.filter(e => e.status === 'deprecated').length;

  const handleExportCSV = () => {
    exportToCSV(entries);
    setShowExportMenu(false);
  };

  const handleExportSeed = () => {
    exportToSeedJSON(entries);
    setShowExportMenu(false);
  };

  const handleExportSlugs = () => {
    exportToSlugIndex(entries);
    setShowExportMenu(false);
  };

  return (
    <header className="top-bar">
      <div className="top-bar-brand">
        <BookOpen size={24} className="logo-icon" />
        <h1>Lunori Glossary Admin</h1>
      </div>

      {hasData && (
        <div className="top-bar-stats">
          <div className="stat-item">
            <span>Total:</span>
            <span className="stat-value">{entries.length}</span>
          </div>
          <div className="stat-item">
            <span>Active:</span>
            <span className="stat-value">{activeCount}</span>
          </div>
          <div className="stat-item">
            <span>Draft:</span>
            <span className="stat-value">{draftCount}</span>
          </div>
          <div className="stat-item">
            <span>Deprecated:</span>
            <span className="stat-value">{deprecatedCount}</span>
          </div>
        </div>
      )}

      <div className="top-bar-actions">
        {hasData && (
          <div className="dropdown">
            <button 
              className="btn btn-primary"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={16} />
              Export
              <ChevronDown size={14} />
            </button>
            
            {showExportMenu && (
              <>
                <div 
                  style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleExportCSV}>
                    <FileSpreadsheet size={16} />
                    Export CSV
                  </button>
                  <button className="dropdown-item" onClick={handleExportSeed}>
                    <FileJson size={16} />
                    Export Seed JSON
                  </button>
                  <button className="dropdown-item" onClick={handleExportSlugs}>
                    <Link2 size={16} />
                    Export Slug Index
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
