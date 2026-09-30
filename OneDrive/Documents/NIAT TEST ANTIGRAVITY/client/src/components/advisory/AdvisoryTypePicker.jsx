import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Stethoscope, Droplets, Bug, CalendarDays, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { useT } from '../../i18n/useT.js';

export function AdvisoryTypePicker() {
  const { t } = useT();

  const types = [
    {
      id: 'crop_recommendation',
      slug: 'crop-recommendation',
      title: t('type_crop_recommendation'),
      description: t('desc_crop_recommendation'),
      icon: Sprout,
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'disease_diagnosis',
      slug: 'disease-diagnosis',
      title: t('type_disease_diagnosis'),
      description: t('desc_disease_diagnosis'),
      icon: Stethoscope,
      color: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'fertilizer_irrigation',
      slug: 'fertilizer-irrigation',
      title: t('type_fertilizer_irrigation'),
      description: t('desc_fertilizer_irrigation'),
      icon: Droplets,
      color: 'bg-sky-100 text-sky-800',
    },
    {
      id: 'pest_management',
      slug: 'pest-management',
      title: t('type_pest_management'),
      description: t('desc_pest_management'),
      icon: Bug,
      color: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'seasonal_plan',
      slug: 'seasonal-plan',
      title: t('type_seasonal_plan'),
      description: t('desc_seasonal_plan'),
      icon: CalendarDays,
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {types.map((type) => {
        const Icon = type.icon;
        return (
          <Link key={type.id} to={`/advisory/new/${type.slug}`}>
            <Card hover className="flex items-start justify-between h-full group">
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-2xl shrink-0 ${type.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
