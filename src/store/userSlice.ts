import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { id:'', name: '', phone:'', avatar: '', status: 0, loginType: 0 },
  reducers: {
    register(state, action) {
      state.id = Math.random().toString(36).substring(2, 16);
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.avatar = action.payload.avatar;
      state.status = action.payload.status || 0; // 默认状态为0
      state.loginType = action.payload.loginType || 0; // 默认登录类型为0
    },
    login(state, action) {

    },
    logout(state) {
      state.status = 0;
    },
  },
});

export const { register, login, logout } = userSlice.actions;
export default userSlice.reducer;
