import CreatorDashboardPage from "@/modules/projects/components/creator-dashboard-page";
import { Suspense } from "react";


export default function CreatorDasboard() {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreatorDashboardPage />
        </Suspense>
    )

}