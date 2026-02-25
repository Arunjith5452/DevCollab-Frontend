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
  GOOGLE_LOGIN: "/api/auth/google/callback",
  LOGOUT: "/api/auth/logout"
};

export const PROJECT_ROUTES = {
  CREATE_PROJECT: "/api/projects",
  PROJECT_LISTING: "/api/projects",
  PROJECT_DETAILS: "/api/projects",
  APPLY_PROJECT: "/api/projects",
  GET_PENDING_APPLICATIONS: "/api/projects",
  APPLICATION_STATUS: "/api/application",
  GET_MY_PROJECT: "/api/user/projects/created",
  GET_APPLIED_PROJECT: "/api/user/projects/applied",
  GET_PROJECT_FOR_EDIT: "/api/projects",
  EDIT_PROJECT: "/api/projects",
  GET_PROJECT_MEMBERS: "/api/projects",
  DISABLE_PROJECT: '/api/projects',
  GET_AI_SUGGESTIONS: "/api/projects",
  GET_MEETINGS: "/api/projects",
  CREATE_MEETING: "/api/meetings",
  UPDATE_MEETING_STATUS: "/api/meetings"
};

export const TASK_ROUTERS = {
  CREATE_TASK: "/api/task",
  GET_ASSIGNEES: "/api/task/assignees",
  ADD_COMMENT: "/api/tasks",
  CREATE_PAYMENT: "/api/payment/create-intent",
  CREATE_CHECKOUT_SESSION: "/api/payment/checkout-session",
  ASSIGN_TASK: "/api/tasks",
  GET_PROJECT_TASKS: "/api/project",
  START_TASK: "/api/tasks",
  SUBMIT_TASK_WORK: "/api/tasks",
  UPDATE_TASK_CRITERIA: "/api/tasks",
  APPROVE_TASK: "/api/tasks",
  REQUEST_TASK_IMPROVEMENT: "/api/tasks"
}

export const USER_ROUTERS = {
  USER_PROFILE: "/api/users/profile",
  EDIT_PROFILE: "/api/users/profile",
  MY_PROFILE: "/api/profile/me"
}

export const ADMIN_ROUTES = {
  GET_ALL_USERS: "/api/admin/users",
  GET_ALL_PROJECTS: "/api/admin/projects",
  GET_DASHBOARD_STATS: "/api/admin/dashboard-stats",
  GET_ACTIVITIES: "/api/admin/activities",
  GET_ALL_SUBSCRIPTIONS: "/api/admin/subscriptions",
  UPDATE_USER_STATUS: (id: string) => `/api/admin/users/${id}/status`,
};

export const PLAN_ROUTES = {
  GET_ACTIVE_PLANS: "/api/plans",
  GET_ALL_PLANS: "/api/admin/plans",
  CREATE_PLAN: "/api/admin/plans",
  EDIT_PLAN: (id: string) => `/api/admin/plans/${id}`,
  TOGGLE_PLAN_STATUS: (id: string) => `/api/admin/plans/${id}/status`,
};
