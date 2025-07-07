import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id:'', name: '', phone:'',
    avatar: 'https://example.com/avatar.jpg', status: 0, loginType: 0 },
  reducers: {
    register(_state, action) {
      _state.id = Math.random().toString(36).substring(2, 16);
      _state.name = action.payload.name;
      _state.phone = action.payload.phone;
      _state.avatar = action.payload.avatar;
      _state.status = action.payload.status || 0; // 默认状态为0
      _state.loginType = action.payload.loginType || 0; // 默认登录类型为0
    },
    login(state, action) {
      state.status = 1;
    },
    logout(state) {
      state.status = 0;
    },
  },
});

export const { register, login, logout } = userSlice.actions;
export default userSlice.reducer;
