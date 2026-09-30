import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmCard } from './FarmCard.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { Landmark } from 'lucide-react';

export function FarmList({ farms = [], isLoading = false }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!farms || farms.length === 0) {
    return (
      <EmptyState
        icon={Landmark}
        title="No farms registered yet"
        description="Add details about your land, soil type, and irrigation source to start receiving tailored AI agricultural guidance."
        actionText="Add Your First Farm"
        onAction={() => navigate('/farms/new')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {farms.map((farm) => (
        <FarmCard key={farm.id} farm={farm} />
      ))}
    </div>
  );
}
