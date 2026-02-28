"use client";

import { useEffect, useState, useCallback } from "react";
import CreatorHeader from "@/shared/common/user-common/Creator-header";
import { CreatorSidebar } from "@/shared/common/user-common/Creator-sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { projectDetails, getProjectStats } from "../services/project.api";
import PageLoader from "@/shared/common/LoadingComponent";

import { useProjectStore } from "@/store/useProjectStore";

import { ProjectDetails } from "../types/project.types";
import { ProjectStats } from "../types/project-stats.types";
import { getCreatorTasks } from "@/modules/tasks/services/task.api";
import { Pagination } from "@/shared/common/Pagination";
import { Task } from "@/types/tasks/task.types";
import EarningTrendGraph from "@/shared/common/charts/EarningTrendGraph";
import ActivityTrendGraph from "@/shared/common/charts/ActivityTrendGraph";
import DashboardDateFilter from "@/shared/common/analytics/DashboardDateFilter";
import UnauthorizedPage from "@/shared/common/guards/UnauthorizedPage";

export default function CreatorDashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId');
    const [project, setProjectData] = useState<ProjectDetails | null>(null);
    const [stats, setStats] = useState<ProjectStats | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [taskLoading, setTaskLoading] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
    const { setProject } = useProjectStore();

    const projectName = project?.title || "Project";
    const memberCount = project?.members?.length || 0;

    const getAssigneeName = (assignedId: string) => {
        if (!assignedId) return "Unassigned";
        const member = project?.members?.find(m => m.userId === assignedId);
        return member?.user?.name || "Unknown";
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 10;

    const [dateRange, setDateRange] = useState<{ startDate: Date | undefined; endDate: Date | undefined }>({
        startDate: undefined,
        endDate: undefined
    });

    const fetchTasks = useCallback(async (page: number) => {
        if (!projectId) return;
        setTaskLoading(true);
        try {
            const res = await getCreatorTasks({
                projectId,
                page,
                limit: pageSize
            });
            console.log("Tasks response:", res);
            setTasks(res.tasks || []);
            const total = res.total || 0;
            setTotalItems(total);
            setTotalPages(Math.ceil(total / pageSize));
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setTaskLoading(false);
        }
    }, [projectId]);

    const fetchProjectData = useCallback(async () => {
        if (!projectId) return;
        try {
            setLoading(true);
            const [details, statsData] = await Promise.all([
                projectDetails(projectId),
                getProjectStats(projectId, dateRange.startDate, dateRange.endDate)
            ]);
            setProjectData(details.data);
            setProject(details.data);
            setStats(statsData);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
            const msg = axiosErr?.response?.data?.message || axiosErr?.message || "";
            if (msg.toLowerCase().includes("creator") || msg.toLowerCase().includes("denied") || msg.toLowerCase().includes("private")) {
                setAccessDeniedMessage("You are not the creator of this project.");
            } else {
                setAccessDeniedMessage("You do not have access to this project's creator dashboard.");
            }
            setAccessDenied(true);
        } finally {
            setLoading(false);
        }
    }, [projectId, dateRange, setProject]);

    useEffect(() => {
        if (!projectId) {
            router.push("/home");
            return;
        }
        fetchProjectData();
        fetchTasks(1);
    }, [projectId, fetchProjectData, fetchTasks, router]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchTasks(newPage);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <PageLoader />
            </div>
        );
    }

    if (accessDenied) {
        return (
            <UnauthorizedPage
                title="Access Denied"
                message={accessDeniedMessage || "You don't have permission to view this project's creator dashboard."}
                redirectTo="/home"
            />
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <CreatorSidebar activeItem="dashboard" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <CreatorHeader />
                <main className="flex-1 overflow-y-auto p-8">
                    {/* Project Overview */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-[#0c1d1a] text-xl font-bold mb-1">Project Overview</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-start">
                                    <div>
                                        <h3 className="text-[#0c1d1a] font-semibold">{projectName}</h3>
                                        <p className="text-[#6b7280] text-sm">
                                            {project?.status === 'active' ? 'Active Project' : 'Project Dashboard'} | {memberCount} Members
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <DashboardDateFilter
                                onFilterChange={(startDate, endDate) => setDateRange({ startDate, endDate })}
                            />
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f5e6d3] border border-[#e6f4f2]">
                                {project?.image ? (
                                    <img src={project.image} alt={projectName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#f5e6d3]">
                                        <div className="w-12 h-12 bg-[#0c1d1a] rounded-sm opacity-10"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex h-full items-center justify-center py-20">
                            <PageLoader />
                        </div>
                    ) : (
                        <>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
                                {/* Completion Rate */}
                                <div className="bg-white p-6 rounded-lg border border-[#e6f4f2]">
                                    <h3 className="text-[#0c1d1a] font-semibold mb-2">Completion Rate</h3>
                                    <p className="text-3xl font-bold text-[#0c1d1a] mb-1">
                                        {stats?.completionRate || 0}%
                                    </p>
                                    <p className="text-[#22c55e] text-sm mb-4">
                                        {stats?.completedTasks || 0} / {stats?.totalTasks || 0} Tasks Completed
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="h-20 bg-[#e6f4f2] rounded flex items-end relative overflow-hidden">
                                                <div
                                                    className="w-full bg-[#006b5b] rounded absolute bottom-0 transition-all duration-1000"
                                                    style={{ height: `${stats?.completionRate || 0}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-[#6b7280] text-xs text-center mt-2">Completed</p>
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-20 bg-[#e6f4f2] rounded flex items-end relative overflow-hidden">
                                                <div
                                                    className="w-full bg-[#cdeae5] rounded absolute bottom-0 transition-all duration-1000"
                                                    style={{ height: `${100 - (stats?.completionRate || 0)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-[#6b7280] text-xs text-center mt-2">Pending</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contributor Performance */}
                                <div className="bg-white p-6 rounded-lg border border-[#e6f4f2]">
                                    <h3 className="text-[#0c1d1a] font-semibold mb-2">Contributor Performance Overview</h3>
                                    <p className="text-3xl font-bold text-[#0c1d1a] mb-1">{stats?.contributorPerformance.length || 0}</p>
                                    <p className="text-[#6b7280] text-sm mb-4">Active Contributors</p>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                        {stats?.contributorPerformance.map((contributor) => (
                                            <div key={contributor.userId} className="flex items-center gap-3">
                                                <span className="text-[#6b7280] text-xs w-24 truncate" title={contributor.name}>
                                                    {contributor.name}
                                                </span>
                                                <div className="flex-1 h-2 bg-[#e6f4f2] rounded overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#006b5b]"
                                                        style={{
                                                            width: `${contributor.totalAssigned > 0
                                                                ? (contributor.completedTasks / contributor.totalAssigned) * 100
                                                                : 0}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-[#6b7280]">
                                                    {contributor.completedTasks}/{contributor.totalAssigned}
                                                </span>
                                            </div>
                                        ))}
                                        {(!stats?.contributorPerformance || stats.contributorPerformance.length === 0) && (
                                            <p className="text-sm text-gray-400">No contributor data yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Graphs */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-8">
                                <div className="h-[400px] w-full">
                                    <EarningTrendGraph
                                        data={stats?.earningsTimeline || []}
                                        title="Project Expenses"
                                    />
                                </div>
                                <div className="h-[400px] w-full">
                                    <ActivityTrendGraph
                                        data={stats?.activityTimeline || []}
                                        type="project"
                                        title="Project Activity"
                                    />
                                </div>
                            </div>

                            {/* Task Management */}
                            <div className="mb-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <h2 className="text-[#0c1d1a] text-xl font-bold">Task Management</h2>
                                    <button onClick={() => router.push(`/create-task?projectId=${projectId}`)} className="w-full sm:w-auto px-4 py-2 bg-[#006b5b] text-white text-sm font-medium rounded hover:bg-[#005a4d]">
                                        Create Task
                                    </button>
                                </div>
                                <div className="bg-white rounded-lg border border-[#e6f4f2] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#f8fcfb] border-b border-[#e6f4f2]">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Task</th>
                                                    <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Assignee</th>
                                                    <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Status</th>
                                                    <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Deadline</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {taskLoading ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                            Loading tasks...
                                                        </td>
                                                    </tr>
                                                ) : tasks.length > 0 ? (
                                                    tasks.map((task, index) => (
                                                        <tr key={task._id || index} className="border-b border-[#e6f4f2] hover:bg-gray-50">
                                                            <td className="px-6 py-4 text-[#0c1d1a] text-sm">{task.title}</td>
                                                            <td className="px-6 py-4 text-[#6b7280] text-sm">
                                                                {getAssigneeName(task.assignedId || "")}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 text-xs font-medium rounded-full 
                                                            ${task.status === 'done' ? 'bg-green-100 text-green-700' :
                                                                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                                            'bg-yellow-100 text-yellow-700'}`}>
                                                                    {task.status === 'done' ? 'Completed' :
                                                                        task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-[#6b7280] text-sm">
                                                                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                            No tasks found for this project.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="border-t border-[#e6f4f2]">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={handlePageChange}
                                                totalItems={totalItems}
                                                itemsPerPage={pageSize}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                        </>
                    )}
                </main>
            </div >
        </div >
    );
}