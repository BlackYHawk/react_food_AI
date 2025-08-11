import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import foodReducer from './slices/foodSlice';
import recipeReducer from './slices/recipeSlice';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import socialReducer from './slices/socialSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['food', 'user', 'recipe', 'social'], // Only persist these reducers
};

const rootReducer = combineReducers({
  food: foodReducer,
  recipe: recipeReducer,
  user: userReducer,
  chat: chatReducer,
  social: socialReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;