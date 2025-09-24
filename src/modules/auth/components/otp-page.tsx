"use client";

import { AuthHeader, OTPInputFields } from "@/shared/common/auth-common";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyOTP } from "../services/auth.api";

export function OTPVerificationPage() {
  const router = useRouter();
  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);


  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);


  const handleVerify = async () => {

    const token = typeof window !== 'undefined' ? localStorage.getItem('tempToken') : null
    console.log("token",token)
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Verification token missing. Please register again.");
      return;
    }

    try {
      const result = await verifyOTP({
        token: token,
        otp: Number(otp)
      });

      localStorage.removeItem('tempToken')

      console.log("OTP verification successful:", result);

      router.push("/login");

    } catch (error: any) {
      console.error("OTP verification error:", error);

      if (error.response?.status === 400) {
        setError("Invalid or expired OTP code. Please try again.");
      } else if (error.response?.status === 404) {
        setError("User not found. Please register again.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      // Call resend OTP API
      // await resendOTP(email);

      setResendTimer(30);
      setCanResend(false);
      setError(null);

      // Show success message (you can add a success state)
      console.log("OTP resent successfully");

    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const handleGoBack = () => {
    router.push("/register");
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <AuthHeader text={''} />

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <div className="w-full" style={{ height: '80px' }}></div>

            {/* Title */}
            <h2 className="text-[#0c1d1a] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Verify Your Account
            </h2>
            <p className="text-[#0c1d1a] text-base font-normal leading-normal pb-8 pt-1 px-4 text-center">
              We've sent a 6-digit code to {email ? email : 'your email'}. Please enter it below to verify your account.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* OTP Input Fields */}
            <div className="w-full text-center">
              <OTPInputFields otp={otp} setOTP={setOTP} />
            </div>

            {/* Verify Button */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full px-4 py-6">
                <button
                  onClick={handleVerify}
                  disabled={isLoading || otp.length !== 6}
                  className={`flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-5 w-full text-base font-bold leading-normal tracking-[0.015em] ${isLoading || otp.length !== 6
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                    : 'bg-[#006b5b] text-white hover:bg-[#005248]'
                    }`}
                >
                  <span className="truncate">
                    {isLoading ? "Verifying..." : "Verify"}
                  </span>
                </button>
              </div>
            </div>

            {/* Resend Links */}
            <div className="flex flex-col items-center gap-2 px-4">
              <button
                onClick={handleResendOTP}
                disabled={!canResend}
                className={`text-sm font-normal leading-normal underline cursor-pointer ${canResend ? 'text-[#45a193] hover:text-[#006b5b]' : 'text-gray-400 cursor-not-allowed'
                  }`}
              >
                Resend OTP
              </button>
              <p className="text-[#45a193] text-sm font-normal leading-normal">
                {canResend ? 'You can resend now' : `Resend available in ${resendTimer}s`}
              </p>
              <button
                onClick={handleGoBack}
                className="text-[#45a193] text-sm font-normal leading-normal underline cursor-pointer flex items-center gap-1 mt-2 hover:text-[#006b5b]"
              >
                <span>←</span>
                <span>Go back to Register</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}