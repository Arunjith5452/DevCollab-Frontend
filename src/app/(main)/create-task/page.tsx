import CreateTaskPage from "@/modules/tasks/components/create-task-page";
import { Suspense } from "react";


export default function CreateTask() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateTaskPage />
        </Suspense>
    )
}