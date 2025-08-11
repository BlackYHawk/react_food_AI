import { NUTRITION_CONSTANTS } from '../constants';

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
export function calculateBMR(
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: 'male' | 'female'
): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

// Calculate TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(
  bmr: number,
  activityLevel: keyof typeof NUTRITION_CONSTANTS.ACTIVITY_MULTIPLIERS
): number {
  return Math.round(bmr * NUTRITION_CONSTANTS.ACTIVITY_MULTIPLIERS[activityLevel]);
}

// Calculate macronutrient distribution
export function calculateMacros(calories: number, distribution: {
  carbs: number; // percentage
  protein: number; // percentage
  fat: number; // percentage
}) {
  return {
    carbs: Math.round((calories * distribution.carbs / 100) / NUTRITION_CONSTANTS.CALORIES_PER_GRAM.CARBS),
    protein: Math.round((calories * distribution.protein / 100) / NUTRITION_CONSTANTS.CALORIES_PER_GRAM.PROTEIN),
    fat: Math.round((calories * distribution.fat / 100) / NUTRITION_CONSTANTS.CALORIES_PER_GRAM.FAT),
  };
}

// Format nutrition values
export function formatNutritionValue(value: number, unit: string = 'g'): string {
  if (value < 1) {
    return `${(value * 1000).toFixed(0)}m${unit}`;
  }
  return `${value.toFixed(1)}${unit}`;
}

// Calculate percentage of daily value
export function calculateDailyValuePercentage(
  value: number,
  nutrient: keyof typeof NUTRITION_CONSTANTS.DAILY_VALUES
): number {
  const dailyValue = NUTRITION_CONSTANTS.DAILY_VALUES[nutrient];
  return Math.round((value / dailyValue) * 100);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Format date for API
export function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Parse date from API
export function parseDateFromAPI(dateString: string): Date {
  return new Date(dateString);
}

// Calculate age from birth date
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Convert units
export function convertWeight(value: number, from: string, to: string): number {
  const conversions: Record<string, number> = {
    'g': 1,
    'kg': 1000,
    'oz': 28.3495,
    'lb': 453.592,
  };
  
  if (!conversions[from] || !conversions[to]) {
    throw new Error(`Unsupported unit conversion: ${from} to ${to}`);
  }
  
  return (value * conversions[from]) / conversions[to];
}

export function convertVolume(value: number, from: string, to: string): number {
  const conversions: Record<string, number> = {
    'ml': 1,
    'l': 1000,
    'cup': 236.588,
    'tbsp': 14.7868,
    'tsp': 4.92892,
    'fl oz': 29.5735,
  };
  
  if (!conversions[from] || !conversions[to]) {
    throw new Error(`Unsupported unit conversion: ${from} to ${to}`);
  }
  
  return (value * conversions[from]) / conversions[to];
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}