import { createSlice } from '@reduxjs/toolkit';
import { LoginStatus, LoginType } from '@/store/LoginStatus';

const userSlice = createSlice({
  name: 'user',
  initialState: { id:'', name: '', avatar: 'https://example.com/avatar.jpg',
    phone:'', status: LoginStatus.NONE, loginType: LoginType.NONE },
  reducers: {
    register(_state, action) {
      _state.id = Math.random().toString(36).substring(2, 16);
      _state.name = action.payload.name;
      _state.phone = action.payload.phone;
      _state.avatar = action.payload.avatar;
      _state.status = action.payload.status || LoginStatus.LOGINED; // 默认状态为0
      _state.loginType = action.payload.loginType || LoginType.PHONE; // 默认登录类型为0
    },
    login(state, action) {
      state.status = LoginStatus.LOGINED;
    },
    logout(state) {
      state.status = LoginStatus.LOGOUT;
    },
  },
});

export const { register, login, logout } = userSlice.actions;
export default userSlice.reducer;
