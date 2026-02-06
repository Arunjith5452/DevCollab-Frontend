import ApplicationsPage from '@/modules/projects/components/application-page'
import { Suspense } from 'react'
import PageLoader from '@/shared/common/LoadingComponent'

export default function ApplyProject() {
    return (
        <Suspense fallback={null}>
            <ApplicationsPage />
        </Suspense>
    )
}