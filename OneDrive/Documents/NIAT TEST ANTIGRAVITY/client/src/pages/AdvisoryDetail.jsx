import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdvisory, useDeleteAdvisory } from '../hooks/useAdvisories.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { AdvisoryHeader } from '../components/results/AdvisoryHeader.jsx';
import { EscalationBanner } from '../components/results/EscalationBanner.jsx';
import { KeyActionsList } from '../components/results/KeyActionsList.jsx';
import { WarningsList } from '../components/results/WarningsList.jsx';
import { DataGapsList } from '../components/results/DataGapsList.jsx';
import { CropRecommendationView } from '../components/results/CropRecommendationView.jsx';
import { DiseaseDiagnosisView } from '../components/results/DiseaseDiagnosisView.jsx';
import { FertilizerIrrigationView } from '../components/results/FertilizerIrrigationView.jsx';
import { PestManagementView } from '../components/results/PestManagementView.jsx';
import { SeasonalPlanView } from '../components/results/SeasonalPlanView.jsx';
import { FeedbackWidget } from '../components/results/FeedbackWidget.jsx';
import { PrintButton } from '../components/results/PrintButton.jsx';
import { AdvisoryChat } from '../components/results/AdvisoryChat.jsx';
import { SafetyDisclaimer } from '../components/results/SafetyDisclaimer.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { Trash2 } from 'lucide-react';

export function AdvisoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: advisory, isLoading, isError } = useAdvisory(id);
  const { mutateAsync: deleteAdvisory, isPending: isDeleting } = useDeleteAdvisory();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteAdvisory(id);
      navigate('/history');
    } catch {
      // Handled by mutation toast
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size="lg" className="text-emerald-600" />
      </div>
    );
  }

  if (isError || !advisory) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Advisory Not Found</h2>
        <p className="text-sm text-slate-600">The requested advisory record could not be loaded or does not exist.</p>
        <Button onClick={() => navigate('/history')} variant="primary">
          Back to History
        </Button>
      </div>
    );
  }

  const outputPayload = advisory.output_payload || {};
  const resultData = outputPayload.result || {};

  const renderResultView = () => {
    switch (advisory.advisory_type) {
      case 'crop_recommendation':
        return <CropRecommendationView result={resultData} />;
      case 'disease_diagnosis':
        return <DiseaseDiagnosisView result={resultData} signedImageUrl={advisory.signed_image_url} />;
      case 'fertilizer_irrigation':
        return <FertilizerIrrigationView result={resultData} />;
      case 'pest_management':
        return <PestManagementView result={resultData} />;
      case 'seasonal_plan':
        return <SeasonalPlanView result={resultData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="KrishiMitra AI Advisory"
        showBack
        actions={
          <div className="flex items-center gap-2">
            <PrintButton />
            <Button
              variant="outline"
              size="sm"
              icon={Trash2}
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:bg-red-50 border-slate-300"
            >
              Delete
            </Button>
          </div>
        }
      />

      <AdvisoryHeader advisory={advisory} />

      <EscalationBanner escalation={outputPayload.escalate_to_expert} />

      <KeyActionsList actions={outputPayload.key_actions} />

      {renderResultView()}

      <WarningsList warnings={outputPayload.warnings} />

      <DataGapsList dataGaps={outputPayload.data_gaps} />

      <FeedbackWidget advisoryId={advisory.id} />

      <AdvisoryChat advisoryId={advisory.id} />

      <SafetyDisclaimer />

      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Advisory Record"
        message="Are you sure you want to permanently delete this saved advisory and any attached chat history?"
        confirmText="Delete Advisory"
        isLoading={isDeleting}
      />
    </div>
  );
}
