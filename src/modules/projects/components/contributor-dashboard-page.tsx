"use client";

import { useEffect, useState } from "react";
import ContributorHeader from "@/shared/common/user-common/contributor-common/ContributorHeader";
import ContributorSidebar from "@/shared/common/user-common/contributor-common/ContributorSidebar";
import { useRouter } from "next/navigation";
import { projectDetails, getContributorStats } from "../services/project.api";
import PageLoader from "@/shared/common/LoadingComponent";
import { useProjectStore } from "@/store/useProjectStore";
import { ProjectDetails } from "../types/project.types";
import { ContributorStats } from "../types/contributor-stats.types";
import { Pagination } from "@/shared/common/Pagination";
import EarningTrendGraph from "@/shared/common/charts/EarningTrendGraph";
import ActivityTrendGraph from "@/shared/common/charts/ActivityTrendGraph";
import DashboardDateFilter from "@/shared/common/analytics/DashboardDateFilter";

export default function ContributorDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{
        projectId: string;
    }>;
}) {
    const router = useRouter();
    const [projectId, setProjectId] = useState<string | null>(null);
    const [project, setProjectData] = useState<ProjectDetails | null>(null);
    const [stats, setStats] = useState<ContributorStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { setProject } = useProjectStore();

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [dateRange, setDateRange] = useState<{ startDate: Date | undefined; endDate: Date | undefined }>({
        startDate: undefined,
        endDate: undefined
    });

    useEffect(() => {
        searchParams.then((params) => {
            const id = params.projectId;
            setProjectId(id);

            if (!id) {
                router.push("/home");
                return;
            }

            setLoading(true);
            Promise.all([
                projectDetails(id),
                getContributorStats(id, currentPage, pageSize, dateRange.startDate, dateRange.endDate)
            ]).then(([resDetails, resStats]) => {
                setProjectData(resDetails.data);
                setStats(resStats.data || resStats);
                setProject({ id: resDetails.data.id, title: resDetails.data.title });
                setLoading(false);
            }).catch(err => {
                setLoading(false);
            });
        });
    }, [searchParams, router, setProject, currentPage, pageSize, dateRange]);



    const projectName = project?.title || "Project";

    const totalTasks = stats?.totalTasksInBreakdown || 0;
    const totalPages = Math.ceil(totalTasks / pageSize);
    const paginatedTasks = stats?.taskBreakdown || [];

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done':
                return 'bg-green-100 text-green-700';
            case 'in-progress':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-yellow-100 text-yellow-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'done':
                return 'Completed';
            case 'in-progress':
                return 'In Progress';
            default:
                return 'Pending';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'released':
                return 'bg-green-100 text-green-700';
            case 'held':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getPaymentStatusLabel = (status: string) => {
        switch (status) {
            case 'released':
                return 'Paid';
            case 'held':
                return 'In Escrow';
            default:
                return 'Not Paid';
        }
    };

    const isInitialLoad = !stats && loading;

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <ContributorSidebar activeItem="dashboard" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <ContributorHeader />
                <main className="flex-1 overflow-y-auto p-8 relative">
                    {/* Project Overview */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-[#0c1d1a] text-xl font-bold mb-1">Project Overview</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-start">
                                    <div>
                                        <h3 className="text-[#0c1d1a] font-semibold">{projectName}</h3>
                                        <p className="text-[#6b7280] text-sm">
                                            {project?.status === 'active' ? 'Active Project' : 'Project Dashboard'}
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

                    {isInitialLoad ? (
                        <div className="flex h-full items-center justify-center py-20">
                            <PageLoader />
                        </div>
                    ) : (
                        <div className="relative">
                            {loading && (
                                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px] transition-all duration-200">
                                    <PageLoader />
                                </div>
                            )}

                            {/* Earnings Cards */}
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg border border-[#e6f4f2]">
                                    <h3 className="text-[#0c1d1a] font-semibold mb-2">Total Earnings</h3>
                                    <p className="text-3xl font-bold text-[#0c1d1a] mb-1">
                                        {formatCurrency(stats?.totalEarnings || 0)}
                                    </p>
                                    <p className="text-[#6b7280] text-sm">From {stats?.totalTasks || 0} tasks</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-[#e6f4f2]">
                                    <h3 className="text-[#0c1d1a] font-semibold mb-2">Paid Earnings</h3>
                                    <p className="text-3xl font-bold text-[#22c55e] mb-1">
                                        {formatCurrency(stats?.paidEarnings || 0)}
                                    </p>
                                    <p className="text-[#6b7280] text-sm">Released payments</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-[#e6f4f2]">
                                    <h3 className="text-[#0c1d1a] font-semibold mb-2">Pending Earnings</h3>
                                    <p className="text-3xl font-bold text-[#f59e0b] mb-1">
                                        {formatCurrency(stats?.pendingEarnings || 0)}
                                    </p>
                                    <p className="text-[#6b7280] text-sm">In escrow or unpaid</p>
                                </div>
                            </div>

                            {/* Analytics Graphs */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="h-[400px]">
                                    <EarningTrendGraph
                                        data={stats?.earningsTimeline || []}
                                        title="My Earnings Trend"
                                    />
                                </div>
                                <div className="h-[400px]">
                                    <ActivityTrendGraph
                                        data={stats?.activityTimeline || []}
                                        type="contributor"
                                        title="My Activity"
                                    />
                                </div>
                            </div>

                            {/* Task Statistics & Completion Rate */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg border border-[#e6f4f2]">
                                    <h3 className="text-[#0c1d1a] font-semibold mb-4">Task Statistics</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#6b7280] text-sm">Total Tasks</span>
                                            <span className="text-[#0c1d1a] font-semibold text-lg">{stats?.totalTasks || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#6b7280] text-sm">Completed Tasks</span>
                                            <span className="text-[#22c55e] font-semibold text-lg">{stats?.completedTasks || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#6b7280] text-sm">Pending Tasks</span>
                                            <span className="text-[#f59e0b] font-semibold text-lg">{stats?.pendingTasks || 0}</span>
                                        </div>
                                    </div>
                                </div>

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
                            </div>

                            {/* Task Table */}
                            <div className="mb-8">
                                <h2 className="text-[#0c1d1a] text-xl font-bold mb-4">Task Details</h2>
                                <div className="bg-white rounded-lg border border-[#e6f4f2] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#f8fcfb] border-b border-[#e6f4f2]">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Task Name</th>
                                                    <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Amount</th>
                                                    <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Creator</th>
                                                    <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Date</th>
                                                    <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Status</th>
                                                    <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Payment</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedTasks.length > 0 ? (
                                                    paginatedTasks.map((task, index) => (
                                                        <tr key={task.taskId || index} className="border-b border-[#e6f4f2] hover:bg-gray-50">
                                                            <td className="px-6 py-4 text-[#0c1d1a] text-sm font-medium">{task.title}</td>
                                                            <td className="px-6 py-4 text-[#0c1d1a] text-sm font-semibold">{formatCurrency(task.amount)}</td>
                                                            <td className="px-6 py-4 text-[#6b7280] text-sm">{task.creatorName}</td>
                                                            <td className="px-6 py-4 text-[#6b7280] text-sm">{formatDate(task.createdAt)}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                                                                    {getStatusLabel(task.status)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(task.paymentStatus)}`}>
                                                                    {getPaymentStatusLabel(task.paymentStatus)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                            No tasks found for this project.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="border-t border-[#e6f4f2]">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={handlePageChange}
                                                totalItems={totalTasks}
                                                itemsPerPage={pageSize}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div >
    );
}
