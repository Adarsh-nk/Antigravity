import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Stethoscope, Droplets, Bug, CalendarDays, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { useT } from '../i18n/useT.js';

export function Landing() {
  const { t } = useT();

  return (
    <div className="space-y-16 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sprout className="w-4 h-4 text-emerald-700" />
          AI-Powered Agronomy Assistant for India
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Trustworthy, Safe & Custom Crop Advice for Every Farmer
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Describe your land, soil, season, and crop issues — or upload a photo. Get evidence-based ICAR style guidance in English, हिन्दी, or मराठी.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" icon={ArrowRight} className="w-full sm:w-auto text-base">
              Get Started Free
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
              Farmer Log In
            </Button>
          </Link>
        </div>
      </section>

      {/* 3 Step Process */}
      <section className="max-w-5xl mx-auto space-y-8 px-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How KrishiMitra Works in 3 Steps</h2>
          <p className="text-sm text-slate-600">Designed for low-bandwidth Android phones with minimal typing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-extrabold text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Add Your Farm</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Save your land area, soil type (black cotton, red, alluvial), irrigation source, and optional lab soil test figures once.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-extrabold text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Choose Advisory Type</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Select crop recommendation, disease photo diagnosis, stage-wise fertilizer plan, IPM pest control, or season calendar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-extrabold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Receive Actionable Advice</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Get structured cards with priority key actions, IPM controls, safety warnings, and expert escalation banners when risk is high.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Supported Advisory Types */}
      <section className="max-w-5xl mx-auto space-y-8 px-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">5 Comprehensive Advisory Services</h2>
          <p className="text-sm text-slate-600">All responses returned in structured farmer-friendly cards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl w-fit">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('type_crop_recommendation')}</h3>
            <p className="text-xs text-slate-600">{t('desc_crop_recommendation')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="p-3 bg-rose-100 text-rose-800 rounded-xl w-fit">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('type_disease_diagnosis')}</h3>
            <p className="text-xs text-slate-600">{t('desc_disease_diagnosis')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="p-3 bg-sky-100 text-sky-800 rounded-xl w-fit">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('type_fertilizer_irrigation')}</h3>
            <p className="text-xs text-slate-600">{t('desc_fertilizer_irrigation')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl w-fit">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('type_pest_management')}</h3>
            <p className="text-xs text-slate-600">{t('desc_pest_management')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 sm:col-span-2 lg:col-span-1">
            <div className="p-3 bg-purple-100 text-purple-800 rounded-xl w-fit">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('type_seasonal_plan')}</h3>
            <p className="text-xs text-slate-600">{t('desc_seasonal_plan')}</p>
          </div>
        </div>
      </section>

      {/* Safety & Trust Disclaimer Section */}
      <section className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold">Built with Mandatory Safety Rules</h2>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Integrated Pest Management (IPM) First:</strong> Biological and cultural methods are prioritized; chemicals are recommended strictly as a last resort.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>No Brand Names or Exact Doses:</strong> Only active ingredient classes are listed. Exact dosing instructions always state compliance with product labels.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Automatic Expert Escalation:</strong> Low-confidence or high-risk disease diagnoses display an escalation banner directing you to your local Krishi Vigyan Kendra (KVK).</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
