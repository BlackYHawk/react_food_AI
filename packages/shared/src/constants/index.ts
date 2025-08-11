// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VERIFY: '/api/auth/verify',
  },
  FOOD: {
    RECOGNIZE: '/api/food/recognize',
    DATABASE: '/api/food/database',
    BY_ID: (id: string) => `/api/food/${id}`,
  },
  USER: {
    PROFILE: '/api/user/profile',
    STATS: '/api/user/stats',
    DELETE: '/api/user/account',
  },
  NUTRITION: {
    LOG: '/api/nutrition/log',
    LOG_BY_DATE: (date: string) => `/api/nutrition/log/${date}`,
    SUMMARY: '/api/nutrition/summary',
    GOALS: '/api/nutrition/goals',
    DELETE_LOG: (id: string) => `/api/nutrition/log/${id}`,
  },
} as const;

// Nutrition constants
export const NUTRITION_CONSTANTS = {
  CALORIES_PER_GRAM: {
    CARBS: 4,
    PROTEIN: 4,
    FAT: 9,
    ALCOHOL: 7,
  },
  DAILY_VALUES: {
    CALORIES: 2000,
    CARBS: 300, // grams
    PROTEIN: 50, // grams
    FAT: 65, // grams
    FIBER: 25, // grams
    SUGAR: 50, // grams
    SODIUM: 2300, // mg
  },
  ACTIVITY_MULTIPLIERS: {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  },
} as const;

// Food categories
export const FOOD_CATEGORIES = [
  'fruit',
  'vegetable',
  'protein',
  'dairy',
  'grain',
  'nuts_seeds',
  'beverages',
  'snacks',
  'desserts',
  'condiments',
  'oils_fats',
  'herbs_spices',
] as const;

// Meal types
export const MEAL_TYPES = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
] as const;

// Activity levels
export const ACTIVITY_LEVELS = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very_active',
] as const;

// Weight goals
export const WEIGHT_GOALS = [
  'lose_weight',
  'maintain_weight',
  'gain_weight',
] as const;

// Common dietary restrictions
export const DIETARY_RESTRICTIONS = [
  'vegetarian',
  'vegan',
  'gluten_free',
  'dairy_free',
  'keto',
  'paleo',
  'low_carb',
  'low_fat',
  'low_sodium',
  'diabetic',
] as const;

// Common allergies
export const COMMON_ALLERGIES = [
  'nuts',
  'peanuts',
  'dairy',
  'eggs',
  'soy',
  'wheat',
  'fish',
  'shellfish',
  'sesame',
] as const;

// Units of measurement
export const UNITS = {
  WEIGHT: ['g', 'kg', 'oz', 'lb'],
  VOLUME: ['ml', 'l', 'cup', 'tbsp', 'tsp', 'fl oz'],
  COUNT: ['piece', 'slice', 'serving'],
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
  NETWORK_ERROR: 'Network error',
  FILE_TOO_LARGE: 'File size too large',
  INVALID_FILE_TYPE: 'Invalid file type',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  FOOD_LOGGED: 'Food logged successfully',
  GOALS_UPDATED: 'Goals updated successfully',
} as const;