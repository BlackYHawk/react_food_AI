//登录状态
enum LoginStatus {
  NONE = 0,
  LOGINED = 1,
  LOGOUT = 2,
  LOGINING = 3,
}

//登录类型
enum LoginType {
  NONE = 0,
  PHONE = 1,
  EMAIL = 2,
}

export {LoginStatus, LoginType};
