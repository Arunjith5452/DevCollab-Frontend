import ApplyToProjectPage from "@/modules/projects/components/apply-project-page";
import { Suspense } from "react";


export default function ApplyProject() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ApplyToProjectPage />
        </Suspense>
    )
}