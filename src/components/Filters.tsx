import { Search } from 'lucide-react';
import { FilterState, SortOption, EntryStatus } from '../lib/types';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
}

export default function Filters({ filters, onFilterChange, categories }: FiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value as EntryStatus | 'all' });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sort: e.target.value as SortOption });
  };

  const handleClearSearch = () => {
    onFilterChange({ ...filters, search: '' });
  };

  return (
    <div className="filters-section">
      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search id, slug, title, short, long, tags, synonyms..."
          value={filters.search}
          onChange={handleSearchChange}
        />
        {filters.search && (
          <button
            className="search-clear-btn"
            onClick={handleClearSearch}
            title="Clear search"
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      <div className="filter-row">
        <select
          className="filter-select"
          value={filters.status}
          onChange={handleStatusChange}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
          <option value="deprecated">Deprecated</option>
        </select>

        <select
          className="filter-select"
          value={filters.category}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.sort}
          onChange={handleSortChange}
        >
          <option value="updated_desc">Updated (Newest)</option>
          <option value="updated_asc">Updated (Oldest)</option>
          <option value="title_asc">Title (A-Z)</option>
          <option value="title_desc">Title (Z-A)</option>
        </select>
      </div>
    </div>
  );
}
