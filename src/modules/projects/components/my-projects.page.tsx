'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen, PlusCircle, Users, Calendar, ExternalLink, Edit, Archive, MoreVertical } from 'lucide-react';
import PageLoader from '@/shared/common/LoadingComponent';
import { disableProject, getMyCreatedProject } from '../services/project.api';
import { getErrorMessage } from '@/shared/utils/ErrorMessage';
import toast from 'react-hot-toast';
import ConfirmModal from '@/shared/common/ConfirmModal';
import { Pagination } from '@/shared/common/Pagination';

interface Project {
    _id: string;
    _title: string;
    _description: string;
    _techStack: string[];
    _members: { userId: string; role: string; status: string }[];
    _status: 'active' | 'completed' | 'disabled';
    _createdAt: string;
}

export function MyProjectsTab() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMenuId, setShowMenuId] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 8;

    const router = useRouter();

    const fetchMyProjects = async () => {
        try {
            setLoading(true);
            const data: any = await getMyCreatedProject(currentPage, itemsPerPage);
            setProjects(data.projects);
            setTotalItems(data.total);
        } catch (err) {
            setError('Failed to load your projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProjects();
    }, [currentPage]);

    const handleEditProject = (projectId: string) => {
        router.push(`/edit-project/${projectId}`);
        setShowMenuId(null);
    };

    const handleDisableProject = async (projectId: string) => {
        toast.loading("Disabling project...");

        try {
            await disableProject(projectId);

            setProjects(prev =>
                prev.map(p =>
                    p._id === projectId ? { ...p, _status: "disabled" } : p
                )
            );

            toast.dismiss();
            toast.success("Project disabled successfully!");
        } catch (err) {
            toast.dismiss();
            toast.error(getErrorMessage(err));
        } finally {
            setShowMenuId(null);
        }
    };

    const getStatusBadge = (status: Project["_status"]) => {
        const styles = {
            active: "bg-green-100 text-green-700",
            disabled: "bg-red-100 text-red-700",
            completed: "bg-gray-100 text-gray-700"
        };

        const labels = {
            active: "Active",
            disabled: "Disabled",
            completed: "Completed"
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    if (loading) return <div className="flex justify-center py-24"><PageLoader /></div>;
    if (error) return <div className="text-center py-24 text-red-600">{error}</div>;

    if (projects.length === 0) {
        return (
            <div className="text-center py-24">
                <FolderOpen className="w-20 h-20 mx-auto mb-6 text-[#45a193]/20" />
                <h3 className="text-2xl font-bold text-[#0c1d1a] mb-3">No projects created yet</h3>
                <p className="text-gray-600 mb-8">Time to build something awesome!</p>
                <button
                    onClick={() => router.push('/create-project')}
                    className="px-8 py-3 bg-[#006b5b] text-white font-bold rounded-lg hover:bg-[#005a4d] transition flex items-center gap-2 mx-auto"
                >
                    <PlusCircle className="w-5 h-5" /> Create Your First Project
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#0c1d1a]">My Projects ({totalItems})</h2>
                <button
                    onClick={() => router.push('/create-project')}
                    className="px-4 py-2 bg-[#006b5b] text-white text-sm font-medium rounded-lg hover:bg-[#005a4d] transition flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" /> New Project
                </button>
            </div>

            {/* Project List */}
            <div className="grid gap-5">
                {projects.map((project) => (
                    <div key={project._id} className="bg-white border border-[#e6f4f2] rounded-xl p-6 hover:shadow-lg transition-shadow relative">

                        {/* Menu */}
                        <div className="absolute top-3 right-3 z-50">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenuId(showMenuId === project._id ? null : project._id);
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>

                            {showMenuId === project._id && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowMenuId(null)} />
                                    <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden">
                                        <button
                                            onClick={() => handleEditProject(project._id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                            Edit Project
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedProjectId(project._id);
                                                setConfirmOpen(true);
                                                setShowMenuId(null);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100"
                                        >
                                            <Archive className="w-4 h-4" />
                                            Disable Project
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Content */}
                        <div className="pr-10">
                            <div className="flex items-center gap-4 mb-3">
                                <h3
                                    onClick={() => router.push(`/project-details/${project._id}`)}
                                    className="text-xl font-bold text-[#0c1d1a] hover:text-[#006b5b] cursor-pointer transition"
                                >
                                    {project._title}
                                </h3>

                                {getStatusBadge(project._status)}
                            </div>

                            <p
                                onClick={() => router.push(`/project-details/${project._id}`)}
                                className="text-gray-600 text-sm line-clamp-2 mb-4 cursor-pointer hover:text-gray-900 transition"
                            >
                                {project._description}
                            </p>

                            {project._techStack?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {project._techStack.map(tech => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-200"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    {project._members?.length || 0} members
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(project._createdAt).toLocaleDateString('en-US')}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.push(`/project-details/${project._id}`)}
                                    className="px-4 py-2 text-sm font-medium text-[#006b5b] border border-[#006b5b] rounded-lg hover:bg-[#006b5b] hover:text-white transition flex items-center gap-1.5"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View
                                </button>

                                <button
                                    onClick={() => router.push(`/creator-dashboard?projectId=${project._id}`)}
                                    className="px-4 py-2 text-sm font-medium bg-[#006b5b] text-white rounded-lg hover:bg-[#005a4d] transition"
                                >
                                    Creator Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            {totalItems > itemsPerPage && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalItems / itemsPerPage)}
                    onPageChange={setCurrentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                />
            )}

            {/* CONFIRM MODAL */}
            <ConfirmModal
                open={confirmOpen}
                title="Disable this project?"
                message="Contributors will no longer be able to join or work on this project. You cannot re-enable it later."
                confirmText="Disable"
                cancelText="Cancel"
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedProjectId(null);
                }}
                onConfirm={() => {
                    if (selectedProjectId) handleDisableProject(selectedProjectId);
                    setConfirmOpen(false);
                }}
            />
        </div>
    );
}
