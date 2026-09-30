import React from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { AdvisoryTypePicker } from '../components/advisory/AdvisoryTypePicker.jsx';

export function AdvisoryNew() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Select AI Advisory Service"
        description="Choose what kind of agricultural guidance you need for your field today."
        showBack
      />

      <AdvisoryTypePicker />
    </div>
  );
}
