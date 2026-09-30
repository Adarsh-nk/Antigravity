import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useFarms } from '../hooks/useFarms.js';
import { useCreateAdvisory } from '../hooks/useAdvisories.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { CropRecommendationForm } from '../components/advisory/CropRecommendationForm.jsx';
import { DiseaseDiagnosisForm } from '../components/advisory/DiseaseDiagnosisForm.jsx';
import { FertilizerIrrigationForm } from '../components/advisory/FertilizerIrrigationForm.jsx';
import { PestManagementForm } from '../components/advisory/PestManagementForm.jsx';
import { SeasonalPlanForm } from '../components/advisory/SeasonalPlanForm.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Landmark } from 'lucide-react';
import { useT } from '../i18n/useT.js';

export function AdvisoryForm() {
  const { type: typeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const initialFarmId = searchParams.get('farmId');
  const navigate = useNavigate();
  const { t } = useT();

  const { farms, isLoading: isFarmsLoading } = useFarms();
  const { mutateAsync: createAdvisory, isPending: isGenerating } = useCreateAdvisory();

  const handleFormSubmit = async ({ payload, imageFile }) => {
    try {
      const saved = await createAdvisory({ payload, imageFile });
      if (saved?.id) {
        navigate(`/advisory/${saved.id}`);
      }
    } catch {
      // Error handled by mutation toast
    }
  };

  if (isFarmsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" className="text-emerald-600" />
      </div>
    );
  }

  if (!farms || farms.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <EmptyState
          icon={Landmark}
          title={t('noFarmsYet')}
          description="You must add at least one farm before generating an AI advisory."
          actionText={t('addFarm')}
          onAction={() => navigate('/farms/new')}
        />
      </div>
    );
  }

  const renderFormBySlug = () => {
    switch (typeSlug) {
      case 'crop-recommendation':
        return (
          <CropRecommendationForm
            farms={farms}
            initialFarmId={initialFarmId}
            onSubmit={(payload) => handleFormSubmit({ payload })}
            isLoading={isGenerating}
          />
        );
      case 'disease-diagnosis':
        return (
          <DiseaseDiagnosisForm
            farms={farms}
            initialFarmId={initialFarmId}
            onSubmit={handleFormSubmit}
            isLoading={isGenerating}
          />
        );
      case 'fertilizer-irrigation':
        return (
          <FertilizerIrrigationForm
            farms={farms}
            initialFarmId={initialFarmId}
            onSubmit={(payload) => handleFormSubmit({ payload })}
            isLoading={isGenerating}
          />
        );
      case 'pest-management':
        return (
          <PestManagementForm
            farms={farms}
            initialFarmId={initialFarmId}
            onSubmit={(payload) => handleFormSubmit({ payload })}
            isLoading={isGenerating}
          />
        );
      case 'seasonal-plan':
        return (
          <SeasonalPlanForm
            farms={farms}
            initialFarmId={initialFarmId}
            onSubmit={(payload) => handleFormSubmit({ payload })}
            isLoading={isGenerating}
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-lg font-bold text-slate-900">Invalid Advisory Type</h2>
          </div>
        );
    }
  };

  const titles = {
    'crop-recommendation': t('type_crop_recommendation'),
    'disease-diagnosis': t('type_disease_diagnosis'),
    'fertilizer-irrigation': t('type_fertilizer_irrigation'),
    'pest-management': t('type_pest_management'),
    'seasonal-plan': t('type_seasonal_plan'),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={titles[typeSlug] || 'Request AI Advisory'}
        description="Fill in your current field conditions for tailored Google Gemini agronomy guidance."
        showBack
      />

      {renderFormBySlug()}
    </div>
  );
}
