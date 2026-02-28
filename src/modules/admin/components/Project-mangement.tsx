"use client";

import { useEffect, useState } from "react";
import { Badge, DataTable, Header, Pagination, Sidebar } from "@/shared/common/admin-common";
import { ChevronDown, Download } from "lucide-react";
import { getAllProjects } from "../services/admin.api";
import { SearchInput } from "@/shared/common/Searching";
import toast from "react-hot-toast";
import PageLoader from "@/shared/common/LoadingComponent";

export interface Project {
    _id: string;
    title: string;
    description?: string;
    creator: { name: string; email: string } | string;
    status: "active" | "completed" | "disabled";
    difficulty: "beginner" | "intermediate" | "advanced";
    createdAt: string;
    updatedAt?: string;
    id?: string;
}

export default function ProjectManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [projects, setProjects] = useState<Project[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const data = await getAllProjects({
                    search: searchTerm,
                    status: statusFilter === "all" ? undefined : statusFilter,
                    difficulty: difficultyFilter === "all" ? undefined : difficultyFilter,
                    page: currentPage,
                    limit: 10,
                });

                setProjects(data.projects);
                setTotalPages(data.total || 1);
                setTotalItems(data.count || 0);
            } catch (err) {
                console.error("Failed to fetch projects:", err);
                toast.error("Failed to load projects");
                setProjects([]);
                setTotalPages(1);
                setTotalItems(0);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [searchTerm, statusFilter, difficultyFilter, currentPage]);


    const columns = [
        {
            label: "Project Title",
            render: (row: Project) => (
                <div className="max-w-xs">
                    <p className="text-sm font-semibold text-gray-900 truncate">{row.title}</p>
                    {row.description && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">{row.description}</p>
                    )}
                </div>
            ),
        },
        {
            label: "Creator",
            render: (row: Project) => (
                <div className="text-sm">
                    {typeof row.creator === "object" && row.creator ? (
                        <>
                            <p className="font-medium text-gray-900">{row.creator.name}</p>
                            <p className="text-xs text-gray-500">{row.creator.email}</p>
                        </>
                    ) : (
                        <span className="text-gray-600">—</span>
                    )}
                </div>
            ),
        },
        {
            label: "Difficulty",
            render: (row: Project) => (
                <Badge
                    variant={
                        row.difficulty.toLowerCase() === "beginner"
                            ? "success"
                            : row.difficulty.toLowerCase() === "intermediate"
                                ? "info"
                                : "warning"
                    }
                >
                    {row.difficulty.charAt(0).toUpperCase() + row.difficulty.slice(1).toLowerCase()}
                </Badge>
            ),
        },
        {
            label: "Status",
            render: (row: Project) => (
                <Badge
                    variant={
                        row.status === "active"
                            ? "success"
                            : row.status === "completed"
                                ? "info"
                                : "default"
                    }
                >
                    {row.status === "disabled"
                        ? "Disabled"
                        : row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
            ),
        },
        {
            label: "Created",
            render: (row: Project) => (
                <span className="text-sm text-gray-600">
                    {new Date(row.createdAt).toLocaleDateString()}
                </span>
            ),
        },

    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar activeItem="projects" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    title="Project Management"
                    subtitle="View and monitor all projects on the platform"
                    actions={
                        <button className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-medium text-gray-700">
                            <Download className="w-4 h-4" />
                            <span className="text-sm">Export</span>
                        </button>
                    }
                />

                <main className="flex-1 p-8 overflow-auto">
                    {/* Filters */}
                    <div className="bg-teal-50 rounded-2xl p-6 mb-6 border border-teal-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search projects by title..."
                            />

                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-teal-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="disabled">Disabled</option>
                                </select>
                                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            <div className="relative">
                                <select
                                    value={difficultyFilter}
                                    onChange={(e) => setDifficultyFilter(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-teal-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="all">All Difficulty</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="relative z-0 min-h-150">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/10 backdrop-blur-sm rounded-2xl">
                                <PageLoader />
                            </div>
                        ) : (
                            <DataTable<Project>
                                columns={columns}
                                data={projects}
                            />
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </main>
            </div>
        </div>
    );
}