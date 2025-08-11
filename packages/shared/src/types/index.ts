// User types
export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  height?: number; // cm
  weight?: number; // kg
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  dietaryRestrictions?: string[];
  allergies?: string[];
  createdAt: string;
  updatedAt: string;
}

// Food types
export interface Food {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  category: string;
  brand?: string;
  servingSize?: number;
  servingUnit?: string;
}

export interface FoodRecognitionResult {
  id: string;
  name: string;
  confidence: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  category: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Nutrition types
export interface NutritionLog {
  id: string;
  userId: string;
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  createdAt: string;
}

export interface NutritionGoals {
  userId: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  updatedAt: string;
}

export interface DailyNutrition {
  date: string;
  meals: {
    breakfast: NutritionLog[];
    lunch: NutritionLog[];
    dinner: NutritionLog[];
    snack: NutritionLog[];
  };
  totals: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  goals: NutritionGoals;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  total: number;
  limit: number;
  offset: number;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Statistics types
export interface UserStats {
  totalScans: number;
  totalCalories: number;
  averageDailyCalories: number;
  favoriteFood: string;
  streakDays: number;
  weeklyProgress: {
    calories: number[];
    weight: number[];
  };
  monthlyGoals: {
    caloriesGoal: number;
    caloriesActual: number;
    weightGoal: number;
    weightActual: number;
  };
}

export interface NutritionSummary {
  period: 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  averages: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  totals: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  dailyData: Array<{
    date: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  }>;
}