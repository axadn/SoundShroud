export const DISABLE_AUTH = "DISABLE_AUTH";
export const ENABLE_LOGIN = "ENABLE_LOGIN";
export const ENABLE_REGISTER = "ENABLE_REGISTER";

export const enableLogin = () =>({
  type: ENABLE_LOGIN
});

export const enableRegister = () =>({
  type: ENABLE_REGISTER
});

export const disableAuthModal = () => ({
  type: DISABLE_AUTH
});
