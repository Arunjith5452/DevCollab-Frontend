import ContributorTasksPage from "@/modules/tasks/components/contributor/contributor-tasks-page";
import { TaskListItem } from "@/modules/projects/types/project.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type TaskStatus = "todo" | "in-progress" | "done"

interface ContributorTasksResponse {
    success: boolean;
    message: string;
    data: TaskListItem[];
}

export default async function ContributorTasks({
    searchParams,
}: {
    searchParams: Promise<{
        projectId: string;
        tab?: string;
    }>;
}) {
    const params = await searchParams;
    const projectId = params.projectId;
    const rawTab = params.tab || "todo";
    const tab = ["todo", "in-progress", "done"].includes(rawTab)
        ? (rawTab as TaskStatus)
        : "todo";

    if (!projectId) {
        redirect("/projects")
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    let tasks: TaskListItem[] = [];

    try {
        const API_BASE = process.env.API_URL || "http://localhost:3001";

        const res = await fetch(
            `${API_BASE}/api/project/${projectId}/tasks/${tab}`,
            {
                method: "GET",
                cache: "no-store",
                credentials: "include",
                headers: accessToken
                    ? { Cookie: `accessToken=${accessToken}` }
                    : {},
            }
        );

        if (res.ok) {
            const payload: ContributorTasksResponse = await res.json();
            tasks = payload.data || [];
        } else if (res.status === 401) {
            redirect("/login");
        }
    } catch (err) {
        console.error("Failed to fetch contributor tasks:", err);
    }

    return (
        <ContributorTasksPage
            initialTasks={tasks}
            initialTab={tab}
            projectId={projectId}
        />
    );
}
