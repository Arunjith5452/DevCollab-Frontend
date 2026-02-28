import TeamMembersPage from "@/modules/projects/components/team-members-page";
import { Member } from "@/modules/projects/types/project.types";
import { cookies } from "next/headers";

export default async function TeamMembers({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; projectId?: string }>;
}) {
  const raw = await searchParams;
  const projectId = raw.projectId;
  const search = raw.search || "";
  const page = raw.page || "1";

  let initialData = {
    users: [] as Member[],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    currentSearch: "",
  };

  try {
    if (projectId) {
      const currentSearch = search.trim();
      const currentPage = Number(page) || 1;
      const API_BASE = process.env.API_URL || "http://localhost:3001";

      const cookieStore = await cookies();
      const accessToken = cookieStore.get('accessToken')?.value

      const res = await fetch(
        `${API_BASE}/api/projects/${projectId}/members?search=${encodeURIComponent(currentSearch)}&page=${currentPage}&limit=10`,
        {
          cache: 'no-store',
          credentials: 'include',
          headers: accessToken
            ? { cookie: `accessToken=${accessToken}` }
            : {},
        }
      );

      if (res.ok) {
        const payload = await res.json();
        const list: Member[] = payload.data?.users || payload.users || [];
        initialData = {
          users: list,
          currentPage: payload.data?.currentPage || currentPage,
          totalPages: payload.data?.totalPages || 1,
          totalItems: payload.data?.totalItems || 0,
          currentSearch,
        };
      }
    }
  } catch (err) {
    console.error("SSR fetch failed for members");
  }

  return <TeamMembersPage initialData={initialData} projectId={projectId || ""} />;
}