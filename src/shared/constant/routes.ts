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
    GOOGLE_LOGIN :"/api/auth/google/callback",
    LOGOUT:"/api/auth/logout"
};

export const PROJECT_ROUTES = {
  CREATE_PROJECT: "/api/projects",          
  PROJECT_LISTING: "/api/projects",        
  PROJECT_DETAILS: "/api/projects" ,
  APPLY_PROJECT:"/api/projects",
  GET_PENDING_APPLICATIONS:"/api/projects",
  APPLICATION_STATUS:"/api/application",
  GET_MY_PROJECT:"/api/user/projects/created",
  GET_APPLIED_PROJECT:"/api/user/projects/applied",
  GET_PROJECT_FOR_EDIT:"/api/projects",
  EDIT_PROJECT:"/api/projects",
  GET_PROJECT_MEMBERS:"/api/projects",
  DISABLE_PROJECT:'/api/projects'

};

export const TASK_ROUTERS ={
  CREATE_TASK:"/api/task",
  GET_ASSIGNEES:"/api/task/assignees"
}

export const USER_ROUTERS = {
  USER_PROFILE : "/api/users/profile",
  EDIT_PROFILE : "/api/users/profile"
}

export const ADMIN_ROUTES = {
  GET_ALL_USERS: "/api/admin/users",
  UPDATE_USER_STATUS: (id: string) => `/api/admin/users/${id}/status`,
};
