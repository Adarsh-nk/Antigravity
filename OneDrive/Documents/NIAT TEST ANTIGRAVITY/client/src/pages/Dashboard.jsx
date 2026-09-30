import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '../api/dashboard.js';
import { useProfile } from '../hooks/useProfile.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { DashboardStats } from '../components/dashboard/DashboardStats.jsx';
import { QuickStartCards } from '../components/dashboard/QuickStartCards.jsx';
import { RecentAdvisories } from '../components/dashboard/RecentAdvisories.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { Landmark, ArrowRight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { useT } from '../i18n/useT.js';

export function Dashboard() {
  const { profile } = useProfile();
  const { t } = useT();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
  });

  const farmerName = profile?.full_name || 'Farmer';
  const showFirstRunBanner = summary && summary.farmCount === 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Namaste, ${farmerName}! 🙏`}
        description="Welcome to your KrishiMitra AI Agricultural Advisory Dashboard."
        actions={
          <Link to="/advisory/new">
            <Button variant="primary" icon={PlusCircle}>
              Get Advisory
            </Button>
          </Link>
        }
      />

      {/* First Run Banner */}
      {showFirstRunBanner && (
        <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-lg space-y-3 border border-emerald-800 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800 text-emerald-300 rounded-2xl">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold">{t('addFarmFirstBanner')}</h3>
              <p className="text-xs text-emerald-200">
                AI crop recommendations, pest diagnosis, and irrigation plans require your land's soil and location details.
              </p>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Link to="/farms/new">
              <Button variant="primary" icon={ArrowRight} className="bg-white text-emerald-900 hover:bg-emerald-50">
                {t('addFarm')}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <>
          <DashboardStats farmCount={summary?.farmCount || 0} advisoryCount={summary?.advisoryCount || 0} />
          <QuickStartCards />
          <RecentAdvisories advisories={summary?.recentAdvisories || []} />
        </>
      )}
    </div>
  );
}
