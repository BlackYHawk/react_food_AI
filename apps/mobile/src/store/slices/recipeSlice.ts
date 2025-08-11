import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  category: string[];
  tags: string[];
  isFavorite: boolean;
  rating: number;
  reviews: number;
}

interface RecipeState {
  recipes: Recipe[];
  favoriteRecipes: string[];
  recommendedRecipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  favoriteRecipes: [],
  recommendedRecipes: [],
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
    },
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const recipeId = action.payload;
      if (state.favoriteRecipes.includes(recipeId)) {
        state.favoriteRecipes = state.favoriteRecipes.filter(id => id !== recipeId);
      } else {
        state.favoriteRecipes.push(recipeId);
      }
      
      // Update the isFavorite property in the recipes array
      const recipeIndex = state.recipes.findIndex(recipe => recipe.id === recipeId);
      if (recipeIndex !== -1) {
        state.recipes[recipeIndex].isFavorite = !state.recipes[recipeIndex].isFavorite;
      }
    },
    setRecommendedRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recommendedRecipes = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setRecipes, 
  addRecipe, 
  toggleFavorite, 
  setRecommendedRecipes, 
  setLoading, 
  setError 
} = recipeSlice.actions;

export default recipeSlice.reducer;