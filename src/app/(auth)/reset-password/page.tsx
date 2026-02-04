import { ResetPasswordPage } from '@/modules/auth/components/resetPassword'
import { Suspense } from 'react'
import PageLoader from '@/shared/common/LoadingComponent'

export default function ResetPassword() {
    return (
        <Suspense fallback={<PageLoader />}>
            <ResetPasswordPage />
        </Suspense>
    )
}