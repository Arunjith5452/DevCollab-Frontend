"use client"

import { AuthLogin } from "./auth-page"
import { login } from "../services/auth.api";

export function LoginPage() {
  return (
    <AuthLogin
      title="Welcome Back"
      description="Log in to collaborate on open-source projects"
      onLogin={login} 
      showSocialButtons={true}
      showForgotPassword={true}
    />
  );
}