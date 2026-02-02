import OtpVerificationForm from "@/modules/auth/components/otp-page";
import { Suspense } from "react";


export default function otpVerification() {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtpVerificationForm type="register" />
        </Suspense>
    )

}