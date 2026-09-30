import React, { useState } from 'react';
import { useAdvisories } from '../hooks/useAdvisories.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { HistoryFilters } from '../components/history/HistoryFilters.jsx';
import { AdvisoryListItem } from '../components/history/AdvisoryListItem.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { FileText } from 'lucide-react';
import { useT } from '../i18n/useT.js';

export function History() {
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useT();

  const debouncedSearch = useDebounce(searchQuery, 350);

  const { data, isLoading } = useAdvisories({
    type: selectedType || undefined,
    q: debouncedSearch || undefined,
    page,
    pageSize: 10,
  });

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('history')}
        description="Browse, search, filter, print, or review past crop advisories."
      />

      <HistoryFilters
        selectedType={selectedType}
        onTypeChange={(type) => {
          setSelectedType(type);
          setPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No advisories matched your search"
          description="Try changing your advisory type filter or search query."
        />
      ) : (
        <div className="space-y-3">
          {items.map((advisory) => (
            <AdvisoryListItem key={advisory.id} advisory={advisory} />
          ))}

          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </div>
      )}
    </div>
  );
}
