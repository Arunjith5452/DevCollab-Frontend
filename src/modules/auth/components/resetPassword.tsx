"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { resetPassword } from "../services/auth.api";
import { getErrorMessage } from "@/shared/utils/ErrorMessage";
import { AuthHeader } from "@/shared/common/auth-common/authHeader";

export function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const email = searchParams.get("email") || ""


  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const result = await resetPassword({ email, newPassword, confirmPassword });
      toast.success("Password reset successfully!");
      router.push("/login")
    } catch (error) {
      console.error(error)
      const message = getErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <AuthHeader text="" showButton={false} onButtonClick={() => { }} />

        {/* Main Content */}
        <div className="px-4 sm:px-10 md:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full sm:w-[512px] max-w-[512px] py-5 flex-1">
            <h2 className="text-[#0c1d1a] text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Reset your password
            </h2>
            <p className="text-[#0c1d1a] text-base font-normal leading-normal pb-8 pt-1 px-4 text-center">
              Enter your new password below
            </p>

            {/* New Password */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-wrap gap-4 px-4 py-3 relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="form-input flex w-full rounded border border-[#cdeae5] bg-white h-14 placeholder:text-[#45a193] p-[15px] pr-10 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-[#45a193] hover:text-[#006b5b] transition-colors"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-wrap gap-4 px-4 py-3 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="form-input flex w-full rounded border border-[#cdeae5] bg-white h-14 placeholder:text-[#45a193] p-[15px] pr-10 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-[#45a193] hover:text-[#006b5b] transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Reset Password Button */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full px-4 py-6">
                <button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className={`flex min-w-[84px] items-center justify-center rounded h-12 px-5 w-full text-base font-bold ${isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#006b5b] text-white cursor-pointer"
                    }`}
                >
                  <span className="truncate">
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </span>
                </button>
              </div>
            </div>

            {/* Back to Login */}
            <div className="flex justify-center px-4">
              <button
                onClick={() => router.push("/login")}
                className="text-[#45a193] text-sm font-normal underline cursor-pointer"
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
