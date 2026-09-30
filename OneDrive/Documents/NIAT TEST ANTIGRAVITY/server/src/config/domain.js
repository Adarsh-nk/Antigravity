export const ADVISORY_TYPES = [
  'crop_recommendation',
  'disease_diagnosis',
  'fertilizer_irrigation',
  'pest_management',
  'seasonal_plan',
];

export const SEASONS = ['kharif', 'rabi', 'zaid', 'perennial_year_round'];

export const SOIL_TYPES = [
  'black_cotton_regur',
  'red',
  'alluvial',
  'laterite',
  'sandy',
  'loamy',
  'clayey',
  'saline_alkaline',
  'not_sure',
];

export const IRRIGATION_SOURCES = [
  'rainfed',
  'canal',
  'borewell_tubewell',
  'open_well',
  'drip',
  'sprinkler',
  'farm_pond',
  'river_lift',
];

export const WATER_AVAILABILITY = ['very_limited', 'limited', 'moderate', 'abundant'];

export const FARMING_PREFERENCES = [
  'conventional',
  'organic',
  'natural_zero_budget',
  'integrated',
];

export const LAND_UNITS = ['acre', 'hectare'];

export const BUDGET_LEVELS = ['low', 'medium', 'high'];

export const GROWTH_STAGES = [
  'pre_sowing',
  'germination_seedling',
  'vegetative',
  'flowering',
  'fruiting_grain_filling',
  'maturity_harvest',
  'post_harvest',
];

export const SYMPTOM_CATEGORIES = [
  'yellowing_leaves',
  'leaf_spots',
  'wilting',
  'stunted_growth',
  'curling_leaves',
  'white_powdery_coating',
  'holes_in_leaves',
  'rotting_stem_root',
  'fruit_flower_drop',
  'insects_visible',
  'discolored_fruit',
  'dry_patches',
  'other',
];

export const RECENT_WEATHER_OPTIONS = [
  'heavy_rain',
  'prolonged_dry',
  'high_humidity',
  'cold_wave',
  'heat_wave',
  'normal',
];

export const GOALS_OPTIONS = [
  'max_profit',
  'low_risk',
  'low_water',
  'low_input_cost',
  'food_security',
  'export_quality',
];

export const LANGUAGES = ['en', 'hi', 'mr'];

export const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  mr: 'Marathi (मराठी)',
};

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const CROP_CATEGORIES = [
  {
    category: 'Cereals',
    crops: ['Rice (Paddy)', 'Wheat', 'Maize', 'Jowar (Sorghum)', 'Bajra (Pearl Millet)', 'Ragi (Finger Millet)'],
  },
  {
    category: 'Pulses',
    crops: ['Tur (Pigeon Pea)', 'Chana (Chickpea)', 'Moong (Green Gram)', 'Urad (Black Gram)', 'Masoor (Lentil)', 'Soybean'],
  },
  {
    category: 'Oilseeds',
    crops: ['Groundnut', 'Sunflower', 'Mustard', 'Sesame', 'Safflower'],
  },
  {
    category: 'Cash Crops',
    crops: ['Cotton', 'Sugarcane', 'Turmeric'],
  },
  {
    category: 'Vegetables',
    crops: ['Tomato', 'Onion', 'Potato', 'Brinjal', 'Chilli', 'Okra', 'Cabbage', 'Cauliflower'],
  },
  {
    category: 'Fruits',
    crops: ['Banana', 'Grapes', 'Pomegranate', 'Mango', 'Orange', 'Papaya'],
  },
  {
    category: 'Spices and Others',
    crops: ['Garlic', 'Ginger', 'Coriander'],
  },
];
