import TasksListingPage from '@/modules/tasks/components/task-listing-page';
import { ProjectTask } from '@/modules/tasks/types/task.types';
import { cookies } from 'next/headers';

export default async function TasksPage({
    searchParams,
}: {
    searchParams: Promise<{
        search?: string;
        status?: string;
        assignee?: string;
        page?: string;
        limit?: string;
        projectId?: string;
    }>;
}) {
    const params = await searchParams;

    const projectId = params.projectId;
    const search = params.search?.trim() || '';
    const status = params.status || 'all';
    const assignee = params.assignee || 'all';
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    const API_BASE = process.env.API_URL || 'http://localhost:3001';
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    let initialData = {
        tasks: [] as ProjectTask[],
        totalPages: 1,
        currentPage: page,
        totalItems: 0,
    };

    try {
        const query = new URLSearchParams();
        if (projectId) query.set('projectId', projectId); if (search) query.set('search', search);
        if (status && status !== 'all') query.set('status', status);
        if (assignee && assignee !== 'all') query.set('assignee', assignee);
        query.set('page', page.toString());
        query.set('limit', limit.toString());

        const res = await fetch(`${API_BASE}/api/task?${query}`, {
            cache: 'no-store',
            credentials: 'include',
            headers: accessToken
                ? { Cookie: `accessToken=${accessToken}` }
                : {},
        })

        if (res.ok) {
            const payload = await res.json();
            const tasks = payload.data?.tasks || [];
            const total = payload.data?.total || 0;
            const totalPages = Math.ceil(total / limit);

            initialData = {
                tasks,
                totalPages,
                currentPage: page,
                totalItems: total,
            };
        }
    } catch (err) {
        console.error('Failed to fetch tasks:', err);
    }

    return (
        <TasksListingPage
            initialData={initialData}
            initialFilters={{
                search,
                status,
                assignee,
            }}
            projectId={projectId || ''}
        />
    );
}