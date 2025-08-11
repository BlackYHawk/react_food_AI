import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  dietaryPreferences: string[];
  allergies: string[];
  loginMethods: {
    email: boolean;
    phone: boolean;
    touchId: boolean;
    faceId: boolean;
  };
  preferredLoginMethod?: 'email' | 'phone' | 'touchId' | 'faceId';
}

interface UserState {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserProfile>) => {
      state.isAuthenticated = true;
      state.profile = action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.profile = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { login, logout, updateProfile, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
