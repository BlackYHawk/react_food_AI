import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { name: '', token: '' },
  reducers: {
    setUser(state, action) {
      state.name = action.payload.name;
      state.token = action.payload.token;
    },
    logout(state) {
      state.name = '';
      state.token = '';
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
