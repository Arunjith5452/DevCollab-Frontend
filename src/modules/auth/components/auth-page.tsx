"use client";

import { AuthHeader, Footer, GitHubButton, GoogleButton } from "@/shared/common/auth-common";
import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PageLoader from "@/shared/common/LoadingComponent";
import { getErrorMessage } from "@/shared/utils/ErrorMessage";
import { signIn } from "next-auth/react";

export function AuthLogin({
  title,
  description,
  onLogin,
  showSocialButtons = true,
  showForgotPassword = true,
  headerButtonText = "Sign Up",
  headerButtonPath = "/register",
}: {
  title: string;
  description?: string;
  onLogin: (data: { email: string; password: string }) => Promise<{ role: string }>;
  showSocialButtons?: boolean;
  showForgotPassword?: boolean;
  headerButtonText?: string;
  headerButtonPath?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await onLogin({ email, password });

      toast.success(`Login successful`);

      try {
        const { useAuthStore } = await import('@/store/useUserStore');
        await useAuthStore.getState().fetchUser(true);
      } catch (err) {
        console.error("Failed to fetch user profile post-login", err);
      }

      const hasAuthData = localStorage.getItem('auth-storage');
      if (!hasAuthData) {
        // Fallback stub to unblock Header.tsx if fetchUser somehow didn't persist fast enough
        localStorage.setItem('auth-storage', JSON.stringify({ state: { user: {} }, version: 0 }));
      }

      if (response.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/home");
      }

    } catch (error) {
      const message = getErrorMessage(error);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageLoader />
      </div>
    );

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <AuthHeader
          text={headerButtonText}
          showButton={!!headerButtonText}
          onButtonClick={() => router.push(headerButtonPath)}
        />

        <div className="px-4 sm:px-10 md:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full sm:w-[512px] max-w-[512px] py-5 flex-1">
            <div className="w-full" style={{ height: "60px" }}></div>

            <h2 className="text-[#0c1d1a] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              {title}
            </h2>
            {description && (
              <p className="text-[#0c1d1a] text-base font-normal leading-normal pb-8 pt-1 px-4 text-center">
                {description}
              </p>
            )}

            {error && (
              <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1 relative">
                  <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">Email</p>
                  <div className="relative">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] border border-[#cdeae5] bg-white h-14 p-[15px] pr-10 text-base font-normal leading-normal placeholder:text-[#45a193] focus:outline-0 focus:ring-0 focus:border-[#cdeae5]"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45a193]">
                      <Mail size={20} />
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Password */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1 relative">
                  <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">Password</p>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] border border-[#cdeae5] bg-white h-14 p-[15px] pr-10 text-base font-normal placeholder:text-[#45a193] leading-normal focus:outline-0 focus:ring-0 focus:border-[#cdeae5]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45a193] hover:text-[#006b5b] transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </label>
              </div>
            </div>

            {/* Forgot Password */}
            {showForgotPassword && (
              <div className="flex justify-center">
                <div className="flex max-w-[480px] w-full px-4">
                  <button
                    onClick={() => router.push("/forgot-password")}
                    className="text-[#45a193] text-sm font-normal leading-normal underline cursor-pointer text-left">
                    Forgot Password?
                  </button>
                </div>
              </div>
            )}

            {/* Login Button */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full px-4 py-6">
                <button
                  onClick={handleLogin}
                  disabled={isLoading || !email || !password}
                  className={`flex min-w-[84px] items-center justify-center rounded h-12 px-5 w-full text-base font-bold ${isLoading || !email || !password
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-[#006b5b] text-white hover:bg-[#005248]"
                    }`}
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>
              </div>
            </div>

            {/* Social Buttons */}
            {showSocialButtons && (
              <>
                <p className="text-[#45a193] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">or</p>
                <div className="flex justify-center">
                  <div className="flex max-w-[480px] w-full flex-col items-stretch px-4 py-3 gap-3">
                    <GitHubButton onClick={() => signIn("github", { callbackUrl: '/callback' })} text={"Sign In with GitHub"} />
                    <GoogleButton onClick={() => signIn("google", { callbackUrl: '/callback' })} text={"Sign In with Google"} />
                  </div>
                </div>

                <p
                  onClick={() => router.push("/register")}
                  className="text-[#45a193] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer hover:text-[#006b5b]"
                >
                  Don&apos;t have an account? Sign Up
                </p>
              </>
            )}

          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}