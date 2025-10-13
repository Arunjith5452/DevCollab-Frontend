"use client";

import { AuthHeader, Footer, GitHubButton, GoogleButton } from "@/shared/common/auth-common";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services/auth.api";
import toast from "react-hot-toast";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });
      toast.success("Login successful:", response.message);
      router.push("/home")
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <AuthHeader text={"Sign Up"} showButton={true} onButtonClick={() => router.push("/register")} />

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">
            <div className="w-full" style={{ height: "60px" }}></div>

            <h2 className="text-[#0c1d1a] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Welcome Back
            </h2>
            <p className="text-[#0c1d1a] text-base font-normal leading-normal pb-8 pt-1 px-4 text-center">
              Log in to collaborate on open-source projects
            </p>

            {/* Error */}
            {error && (
              <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">Email</p>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border border-[#cdeae5] bg-white focus:border-[#cdeae5] h-14 placeholder:text-[#45a193] p-[15px] text-base font-normal leading-normal"
                  />
                </label>
              </div>
            </div>

            {/* Password */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">Password</p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border border-[#cdeae5] bg-white focus:border-[#cdeae5] h-14 placeholder:text-[#45a193] p-[15px] text-base font-normal leading-normal"
                  />
                </label>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full px-4">
                <button
                  onClick={() => router.push("/forgot-password")}
                  className="text-[#45a193] text-sm font-normal leading-normal underline cursor-pointer text-left">
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Log In Button */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full px-4 py-6">
                <button
                  onClick={handleLogin}
                  disabled={isLoading || !email || !password}
                  className={`flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-5 w-full text-base font-bold leading-normal tracking-[0.015em] ${isLoading || !email || !password
                      ? "bg-gray-400 cursor-not-allowed text-gray-200"
                      : "bg-[#006b5b] text-white hover:bg-[#005248]"
                    }`}
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>
              </div>
            </div>

            <p className="text-[#45a193] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">or</p>

            {/* Social Login Buttons */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-col items-stretch px-4 py-3 gap-3">
                <GitHubButton onClick={() => { }} text={"Sign In with GitHub"} />
                <GoogleButton onClick={() => { }} text={"Sign In with Google"} />
              </div>
            </div>

            <p className="text-[#45a193] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer">
              Don't have an account? Sign Up
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
