import { ResetPasswordPage } from '@/modules/auth/components/resetPassword'
import { Suspense } from 'react'

export default function ResetPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordPage />
        </Suspense>
    )
}