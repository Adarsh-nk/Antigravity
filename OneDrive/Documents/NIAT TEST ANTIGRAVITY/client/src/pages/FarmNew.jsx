import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarms } from '../hooks/useFarms.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { FarmForm } from '../components/farms/FarmForm.jsx';
import { Card } from '../components/ui/Card.jsx';
import { useT } from '../i18n/useT.js';

export function FarmNew() {
  const { createFarm, isCreating } = useFarms();
  const navigate = useNavigate();
  const { t } = useT();

  const handleSubmit = async (data) => {
    try {
      await createFarm(data);
      navigate('/farms');
    } catch {
      // Handled by hook error toast
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={t('addFarm')}
        description="Enter your farm's location, soil type, and irrigation details for accurate AI advice."
        showBack
      />

      <Card>
        <FarmForm onSubmit={handleSubmit} isLoading={isCreating} />
      </Card>
    </div>
  );
}
