export const AUTH_ROUTES = {
    SIGNUP: "/api/auth/signup",
    LOGIN: "/api/auth/login",
    VERIFY_OTP: "/api/auth/verify-otp",
    VERIFY_FORGOT_OTP: "/api/auth/verifyForgot-otp",
    RESEND_OTP: "/api/auth/resend-otp",
    RESEND_FORGOT_OTP: "/api/auth/resendForgot-otp",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    REFRESH_TOKEN: "/api/auth/refresh",
};

export const ADMIN_ROUTES = {
  GET_ALL_USERS: "/api/admin/users",
  UPDATE_USER_STATUS: (id: string) => `/api/admin/users/${id}/status`,
};
