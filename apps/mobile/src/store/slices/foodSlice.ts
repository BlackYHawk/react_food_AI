import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FoodItem {
    id: string;
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    confidence: number;
    date: string;
    imageUri?: string;
}

interface FoodState {
    scannedItems: FoodItem[];
    dailyGoals: {
        calories: number;
        carbs: number;
        protein: number;
        fat: number;
    };
    loading: boolean;
    error: string | null;
}

const initialState: FoodState = {
    scannedItems: [],
    dailyGoals: {
        calories: 2000,
        carbs: 250,
        protein: 50,
        fat: 70,
    },
    loading: false,
    error: null,
};

const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {
        addScannedItem: (state, action: PayloadAction<FoodItem>) => {
            state.scannedItems.unshift(action.payload);
        },
        removeScannedItem: (state, action: PayloadAction<string>) => {
            state.scannedItems = state.scannedItems.filter(item => item.id !== action.payload);
        },
        updateDailyGoals: (state, action: PayloadAction<Partial<typeof state.dailyGoals>>) => {
            state.dailyGoals = { ...state.dailyGoals, ...action.payload };
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearFoodHistory: (state) => {
            state.scannedItems = [];
        },
    },
});

export const {
    addScannedItem,
    removeScannedItem,
    updateDailyGoals,
    setLoading,
    setError,
    clearFoodHistory
} = foodSlice.actions;

export default foodSlice.reducer;