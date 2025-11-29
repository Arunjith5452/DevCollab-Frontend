import CreatorHeader from "@/shared/common/user-common/Creator-header";
import { CreatorSidebar } from "@/shared/common/user-common/Creator-sidebar";

export default function CreatorDashboardPage() {
    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <CreatorSidebar activeItem="dashboard" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <CreatorHeader projectName="Project Alpha" />
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="mb-8">
                        <h2 className="text-[#0c1d1a] text-xl font-bold mb-4">Project Overview</h2>
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-[#0c1d1a] font-semibold mb-1">Project Alpha</h3>
                                <p className="text-[#6b7280] text-sm">40% Tasks Completed | 8 Active Contributors | 5 Open PRs</p>
                            </div>
                            <div className="w-32 h-32 rounded-lg overflow-hidden bg-[#f5e6d3]">
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f5e6d3' width='200' height='200'/%3E%3Cellipse cx='100' cy='100' rx='60' ry='80' fill='%23e8d4c0'/%3E%3C/svg%3E" alt="Project" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {/* Completion Rate */}
                        <div className="bg-white p-6 rounded-lg border border-[#e6f4f2]">
                            <h3 className="text-[#0c1d1a] font-semibold mb-2">Completion Rate</h3>
                            <p className="text-3xl font-bold text-[#0c1d1a] mb-1">+5%</p>
                            <p className="text-[#22c55e] text-sm mb-4">Last 30 Days +5%</p>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="h-20 bg-[#e6f4f2] rounded flex items-end">
                                        <div className="w-full h-16 bg-[#006b5b] rounded"></div>
                                    </div>
                                    <p className="text-[#6b7280] text-xs text-center mt-2">Completed</p>
                                </div>
                                <div className="flex-1">
                                    <div className="h-20 bg-[#e6f4f2] rounded flex items-end">
                                        <div className="w-full h-12 bg-[#cdeae5] rounded"></div>
                                    </div>
                                    <p className="text-[#6b7280] text-xs text-center mt-2">Pending</p>
                                </div>
                            </div>
                        </div>

                        {/* Contributor Performance */}
                        <div className="bg-white p-6 rounded-lg border border-[#e6f4f2]">
                            <h3 className="text-[#0c1d1a] font-semibold mb-2">Contributor Performance Overview</h3>
                            <p className="text-3xl font-bold text-[#0c1d1a] mb-1">+15%</p>
                            <p className="text-[#22c55e] text-sm mb-4">Last 30 Days +15%</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#6b7280] text-xs w-24">Contributor 1</span>
                                    <div className="flex-1 h-2 bg-[#e6f4f2] rounded overflow-hidden">
                                        <div className="h-full w-3/4 bg-[#006b5b]"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#6b7280] text-xs w-24">Contributor 2</span>
                                    <div className="flex-1 h-2 bg-[#e6f4f2] rounded overflow-hidden">
                                        <div className="h-full w-1/4 bg-[#006b5b]"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#6b7280] text-xs w-24">Contributor 3</span>
                                    <div className="flex-1 h-2 bg-[#e6f4f2] rounded overflow-hidden">
                                        <div className="h-full w-2/3 bg-[#006b5b]"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#6b7280] text-xs w-24">Contributor 4</span>
                                    <div className="flex-1 h-2 bg-[#e6f4f2] rounded overflow-hidden">
                                        <div className="h-full w-1/2 bg-[#006b5b]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task Management */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[#0c1d1a] text-xl font-bold">Task Management</h2>
                            <button className="px-4 py-2 bg-[#006b5b] text-white text-sm font-medium rounded hover:bg-[#005a4d]">
                                Create Task
                            </button>
                        </div>
                        <div className="bg-white rounded-lg border border-[#e6f4f2] overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-[#f8fcfb] border-b border-[#e6f4f2]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Task</th>
                                        <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Assignee</th>
                                        <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Status</th>
                                        <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Deadline</th>
                                        <th className="px-6 py-3 text-left text-[#6b7280] text-xs font-medium">Reminder</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[#e6f4f2]">
                                        <td className="px-6 py-4 text-[#0c1d1a] text-sm">Implement user authentication</td>
                                        <td className="px-6 py-4 text-[#6b7280] text-sm">Ethan Harper</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">In Progress</span>
                                        </td>
                                        <td className="px-6 py-4 text-[#6b7280] text-sm">2024-08-15</td>
                                        <td className="px-6 py-4 text-[#6b7280] text-sm">true</td>
                                    </tr>
                                    <tr className="border-b border-[#e6f4f2]">
                                        <td className="px-6 py-4 text-[#0c1d1a] text-sm">Design landing page</td>
                                        <td className="px-6 py-4 text-[#6b7280] text-sm">Olivia Bennett</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Completed</span>
                                        </td>
                                        <td className="px-6 py-4 text-[#6b7280] text-sm">2024-08-10</td>
                                        <td className="px-6 py-4 text-[#6b7280] text-sm">false</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-[#0c1d1a] text-sm">Test user authentication</td>
                                        <td className="px-6 py-4 text-[#6b7280] text-sm">Noah Carter</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Pending</span>
                                        </td>
                                        <td className="px-6 py-4 text-[#6b7280] text-sm">2024-08-20</td>
                                        <td className="px-6 py-4 text-[#6b7280] text-sm">true</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="flex items-center justify-center gap-2 py-4 border-t border-[#e6f4f2]">
                                <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8fcfb] rounded">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center bg-[#006b5b] text-white text-sm font-medium rounded">1</button>
                                <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8fcfb] text-sm rounded">2</button>
                                <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8fcfb] text-sm rounded">3</button>
                                <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8fcfb] text-sm rounded">4</button>
                                <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8fcfb] text-sm rounded">5</button>
                                <span className="text-[#6b7280] text-sm">...</span>
                                <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8fcfb] text-sm rounded">10</button>
                                <button className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f8fcfb] rounded">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}