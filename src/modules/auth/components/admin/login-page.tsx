"use client"

import { AuthLogin } from "../auth-page"
import { login } from "../../services/auth.api"

export function AdminLoginPage() {
  return (
    <AuthLogin
      title="Admin Login"
      onLogin={login} 
      showSocialButtons={false}
      showForgotPassword={false}
      headerButtonText=""
    />
  );
}
