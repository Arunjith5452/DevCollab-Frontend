"use client";

import { AuthHeader } from "@/shared/common/auth-common";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { forgotPassword } from "../services/auth.api";

export function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      toast.success("OTP sent to your email!");

      router.push(`/forgot-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error("hello", err);
      setError(err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <AuthHeader text={"Login"} showButton={true} onButtonClick={() => router.push("\login")} />

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <div className="w-full" style={{ height: "120px" }}></div>

            {/* Title */}
            <h2 className="text-[#0c1d1a] text-[28px] font-bold leading-tight px-4 text-center pb-8 pt-5">
              Forgot your password?
            </h2>

            {/* Email Input */}
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center">
                <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#0c1d1a] text-base font-medium leading-normal pb-2">
                      Email address
                    </p>
                    <div className="relative">
                      <input
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border border-[#cdeae5] bg-white focus:border-[#cdeae5] h-14 placeholder:text-[#45a193] p-[15px] pr-12 text-base font-normal leading-normal"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-[#45a193]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <div className="flex max-w-[480px] w-full px-4 py-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-5 w-full bg-[#006b5b] text-white text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-70"
                  >
                    {isLoading ? "Sending..." : "Submit"}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-center font-medium">{error}</p>
              )}
            </form>

            {/* Back to Login */}
            <div className="flex justify-center px-4 mt-4">
              <button
                onClick={() => router.push("/login")}
                className="text-[#45a193] text-sm font-normal leading-normal underline cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
