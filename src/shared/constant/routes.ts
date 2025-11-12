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
    GOOGLE_LOGIN :"/api/auth/google/callback"
};

export const PROJECT_ROUTES = {
  CREATE_PROJECT: "/api/users/projects",          
  PROJECT_LISTING: "/api/users/projects",        
  PROJECT_DETAILS: "/api/users/projects" 
};


export const ADMIN_ROUTES = {
  GET_ALL_USERS: "/api/admin/users",
  UPDATE_USER_STATUS: (id: string) => `/api/admin/users/${id}/status`,
};
