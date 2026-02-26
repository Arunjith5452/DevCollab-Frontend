import MeetingsPage from "@/modules/projects/components/meeting-page"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreatorMeetingsPage({
    searchParams,
}: {
    searchParams: Promise<{ projectId: string }>;
}) {
    const params = await searchParams;
    const projectId = params.projectId;

    if (!projectId) {
        redirect("/projects");
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    let initialMeetings = [];

    try {
        const API_BASE = process.env.API_URL || "http://localhost:3001";
        const res = await fetch(`${API_BASE}/api/projects/${projectId}/meetings`, {
            method: "GET",
            cache: "no-store",
            headers: accessToken ? { Cookie: `accessToken=${accessToken}` } : {},
        });

        if (res.ok) {
            const payload = await res.json();
            initialMeetings = payload.data || [];
        }
    } catch (err) {
        console.error("Failed to fetch meetings on server:", err);
    }

    return (
        <MeetingsPage
            forcedRole="creator"
            initialMeetings={initialMeetings}
            projectId={projectId}
        />
    )
}
