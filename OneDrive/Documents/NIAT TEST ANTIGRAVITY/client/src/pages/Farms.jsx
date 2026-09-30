import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useFarms } from '../hooks/useFarms.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { FarmList } from '../components/farms/FarmList.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useT } from '../i18n/useT.js';

export function Farms() {
  const { farms, isLoading } = useFarms();
  const { t } = useT();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('farms')}
        description="Manage your plots, land area, soil types, irrigation sources, and soil test values."
        actions={
          <Link to="/farms/new">
            <Button variant="primary" icon={PlusCircle}>
              {t('addFarm')}
            </Button>
          </Link>
        }
      />

      <FarmList farms={farms} isLoading={isLoading} />
    </div>
  );
}
