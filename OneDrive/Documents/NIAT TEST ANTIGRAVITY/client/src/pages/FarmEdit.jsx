import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFarm, useFarms } from '../hooks/useFarms.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { FarmForm } from '../components/farms/FarmForm.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';

export function FarmEdit() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { data: farm, isLoading: isFetching } = useFarm(farmId);
  const { updateFarm, isUpdating } = useFarms();

  const handleSubmit = async (data) => {
    try {
      await updateFarm({ id: farmId, data });
      navigate('/farms');
    } catch {
      // Handled by hook error toast
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" className="text-emerald-600" />
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-900">Farm Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={`Edit ${farm.name}`}
        description="Update land area, soil parameters, or irrigation sources."
        showBack
      />

      <Card>
        <FarmForm initialData={farm} onSubmit={handleSubmit} isLoading={isUpdating} />
      </Card>
    </div>
  );
}
