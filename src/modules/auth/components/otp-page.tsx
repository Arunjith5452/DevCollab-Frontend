"use client";

import { AuthHeader, OTPInputFields } from "@/shared/common/auth-common";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useTimer } from "react-timer-hook";
import { resendOTP, verifyOTP, resendForgotOTP, verifyForgotOTP } from '../services/auth.api'
import { getErrorMessage } from "@/shared/utils/ErrorMessage";

interface Props {
  type: "register" | "forgot";
  email?: string;
}

export default function OtpVerificationForm({ type, email }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotEmail = email || searchParams.get("email") || "";

  const time = new Date();
  time.setSeconds(time.getSeconds() + 30);
  const { seconds, restart, isRunning } = useTimer({
    expiryTimestamp: time,
    onExpire: () => toast.success("Resend available now "),
  });

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (type === "register") {
        const token = localStorage.getItem("tempToken");
        if (!token) throw new Error("Session expired. Please register again.");

        await verifyOTP({ token, otp: Number(otp) });
        localStorage.removeItem("tempToken");
        toast.success("Account verified successfully ");
        router.push("/login");
      } else {
        if (!forgotEmail) throw new Error("Session expired. Please try again.");
        await verifyForgotOTP({ email: forgotEmail, otp: Number(otp) });
        toast.success("OTP verified successfully ");
        router.push(`/reset-password?email=${encodeURIComponent(forgotEmail)}`);
      }
    } catch (error: any) {
      const message = getErrorMessage(error);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (isRunning) return;

    try {
      if (type === "register") {
        const token = localStorage.getItem("tempToken");
        console.log("Resend OTP token:", token);
        if (!token) throw new Error("Session expired. Please register again.");
        await resendOTP(token);
      } else {
        if (!forgotEmail) throw new Error("Session expired. Please try again.");
        await resendForgotOTP(forgotEmail);
      }

      const newTime = new Date();
      newTime.setSeconds(newTime.getSeconds() + 30);
      restart(newTime);
      toast.success("OTP resent successfully ✅");
    } catch (error) {
      console.error("Resend OTP error:", error);
      const message = getErrorMessage(error);
      setError(message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleGoBack = () => {
    router.push(type === "register" ? "/register" : "/forgot-password");
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <AuthHeader text={""} showButton={false} onButtonClick={() => { }} />

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">
            <div className="w-full" style={{ height: "80px" }}></div>

            <h2 className="text-[#0c1d1a] text-[28px] font-bold text-center pb-3 pt-5">
              {type === "register" ? "Verify Your Account" : "Verify Your OTP"}
            </h2>
            <p className="text-[#0c1d1a] text-base text-center pb-8 px-4">
              {type === "register"
                ? "We’ve sent a 6-digit code to your email. Please verify your account."
                : "Enter the 6-digit OTP sent to your registered email to reset your password."}
            </p>

            {error && (
              <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="w-full text-center">
              <OTPInputFields otp={otp} setOTP={setOTP} />
            </div>

            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full px-4 py-6">
                <button
                  onClick={handleVerify}
                  disabled={isLoading || otp.length !== 6}
                  className={`flex items-center justify-center rounded h-12 px-5 w-full text-base font-bold ${isLoading || otp.length !== 6
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-[#006b5b] text-white hover:bg-[#005248]"
                    }`}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 px-4">
              <button
                onClick={handleResendOTP}
                disabled={isRunning}
                className={`text-sm underline ${isRunning
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#45a193] hover:text-[#006b5b]"
                  }`}
              >
                {isRunning ? `Resend OTP in ${seconds}s` : "Resend OTP"}
              </button>

              <button
                onClick={handleGoBack}
                className="text-[#45a193] text-sm underline flex items-center gap-1 mt-2 hover:text-[#006b5b]"
              >
                <span>←</span>
                <span>Go back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
