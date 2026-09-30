import { Router } from 'express';
import * as domain from '../config/domain.js';

const router = Router();

router.get('/meta/options', (req, res) => {
  res.json({
    success: true,
    data: {
      advisoryTypes: domain.ADVISORY_TYPES,
      seasons: domain.SEASONS,
      soilTypes: domain.SOIL_TYPES,
      irrigationSources: domain.IRRIGATION_SOURCES,
      waterAvailability: domain.WATER_AVAILABILITY,
      farmingPreferences: domain.FARMING_PREFERENCES,
      landUnits: domain.LAND_UNITS,
      budgetLevels: domain.BUDGET_LEVELS,
      growthStages: domain.GROWTH_STAGES,
      symptomCategories: domain.SYMPTOM_CATEGORIES,
      recentWeatherOptions: domain.RECENT_WEATHER_OPTIONS,
      goalsOptions: domain.GOALS_OPTIONS,
      languages: domain.LANGUAGES,
      languageNames: domain.LANGUAGE_NAMES,
      indianStates: domain.INDIAN_STATES,
      cropCategories: domain.CROP_CATEGORIES,
    },
  });
});

export default router;
