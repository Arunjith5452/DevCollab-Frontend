import CreateTaskPage from "@/modules/tasks/components/create-task-page";
import { Suspense } from "react";
import PageLoader from "@/shared/common/LoadingComponent";


export default function CreateTask() {
    return (
        <Suspense fallback={null}>
            <CreateTaskPage />
        </Suspense>
    )
}