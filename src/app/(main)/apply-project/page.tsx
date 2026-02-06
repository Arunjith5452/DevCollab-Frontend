import ApplyToProjectPage from "@/modules/projects/components/apply-project-page";
import { Suspense } from "react";
import PageLoader from "@/shared/common/LoadingComponent";


export default function ApplyProject() {
    return (
        <Suspense fallback={null}>
            <ApplyToProjectPage />
        </Suspense>
    )
}