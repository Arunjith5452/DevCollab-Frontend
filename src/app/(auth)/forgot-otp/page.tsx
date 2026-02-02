"use client"

import OtpVerificationForm from "@/modules/auth/components/otp-page";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ForgotOtpContent() {
  const params = useSearchParams();
  const email = params.get("email") ?? undefined

  return <OtpVerificationForm type="forgot" email={email} />;
}

export default function ForgotOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotOtpContent />
    </Suspense>
  );
}
