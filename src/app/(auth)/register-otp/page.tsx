import OtpVerificationForm from "@/modules/auth/components/otp-page";
import { Suspense } from "react";
import PageLoader from "@/shared/common/LoadingComponent";


export default function otpVerification() {

    return (
        <Suspense fallback={null}>
            <OtpVerificationForm type="register" />
        </Suspense>
    )

}
