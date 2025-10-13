"use client"


import OtpVerificationForm from "@/modules/auth/components/otp-page";
import { useSearchParams } from "next/navigation";

export default function ForgotOtpPage() {
  const params = useSearchParams();
  const email = params.get("email") ?? undefined

  return <OtpVerificationForm type="forgot" email={email} />;
}
