import React from 'react';
import { Search, Filter } from 'lucide-react';
import { ADVISORY_TYPES } from '../../config/domain.js';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';

export function HistoryFilters({ selectedType, onTypeChange, searchQuery, onSearchChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 shrink-0" />
        <Input
          placeholder="Search advisories by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="w-full sm:w-64">
        <Select value={selectedType || ''} onChange={(e) => onTypeChange(e.target.value)}>
          <option value="">All Advisory Types</option>
          {ADVISORY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, ' ').toUpperCase()}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
