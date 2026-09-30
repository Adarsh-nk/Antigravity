import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Stethoscope, Droplets, Bug, CalendarDays, Plus } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { useT } from '../../i18n/useT.js';

export function QuickStartCards() {
  const { t } = useT();

  const cards = [
    {
      slug: 'crop-recommendation',
      title: t('type_crop_recommendation'),
      icon: Sprout,
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      slug: 'disease-diagnosis',
      title: t('type_disease_diagnosis'),
      icon: Stethoscope,
      color: 'bg-rose-100 text-rose-800',
    },
    {
      slug: 'fertilizer-irrigation',
      title: t('type_fertilizer_irrigation'),
      icon: Droplets,
      color: 'bg-sky-100 text-sky-800',
    },
    {
      slug: 'pest-management',
      title: t('type_pest_management'),
      icon: Bug,
      color: 'bg-amber-100 text-amber-800',
    },
    {
      slug: 'seasonal-plan',
      title: t('type_seasonal_plan'),
      icon: CalendarDays,
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-extrabold text-slate-900">Request New AI Advisory</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.slug} to={`/advisory/new/${card.slug}`}>
              <Card hover className="p-4 flex flex-col items-center text-center space-y-2 h-full group">
                <div className={`p-3 rounded-2xl ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug">
                  {card.title}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold inline-flex items-center gap-0.5">
                  <Plus className="w-3 h-3" /> Get Advice
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
