import ApplicationsPage from '@/modules/projects/components/application-page'
import { Suspense } from 'react'

export default function ApplyProject() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ApplicationsPage />
        </Suspense>
    )
}