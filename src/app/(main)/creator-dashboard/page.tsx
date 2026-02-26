import CreatorDashboardPage from "@/modules/projects/components/creator-dashboard-page";
import { Suspense } from "react";
import PageLoader from "@/shared/common/LoadingComponent";


export default function CreatorDasboard() {

    return (
        <Suspense fallback={null}>
            <CreatorDashboardPage />
        </Suspense>
    )

}