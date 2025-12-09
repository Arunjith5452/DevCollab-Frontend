'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen, PlusCircle, Users, Calendar, ExternalLink, Edit, Archive, MoreVertical } from 'lucide-react';
import PageLoader from '@/shared/common/LoadingComponent';
import { getMyCreatedProject } from '../services/project.api';

interface Project {
    _id: string;
    _title: string;
    _description: string;
    _techStack: string[];
    _members: { userId: string; role: string; status: string }[];
    _status: 'active' | 'completed';
    _createdAt: string;
}

export function MyProjectsTab() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMenuId, setShowMenuId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchMyProjects = async () => {
            try {
                setLoading(true);
                const { data } = await getMyCreatedProject();
                setProjects(data);
            } catch (err) {
                setError('Failed to load your projects');
            } finally {
                setLoading(false);
            }
        };
        fetchMyProjects();
    }, []);

    const handleEditProject = (projectId: string) => {
        router.push(`/edit-project/${projectId}`);
        setShowMenuId(null);
    };

    const handleDisableProject = (projectId: string) => {
        if (!window.confirm('Disable this project? It will no longer appear in searches.')) return;
        setProjects(prev =>
            prev.map(p => (p._id === projectId ? { ...p, _status: 'completed' as const } : p))
        );
        setShowMenuId(null);
    };

    if (loading) return <div className="flex justify-center py-24"><PageLoader /></div>;
    if (error) return <div className="text-center py-24 text-red-600">{error}</div>;
    if (projects.length === 0) {
        return (
            <div className="text-center py-24">
                <FolderOpen className="w-20 h-20 mx-auto mb-6 text-[#45a193]/20" />
                <h3 className="text-2xl font-bold text-[#0c1d1a] mb-3">No projects created yet</h3>
                <p className="text-gray-600 mb-8">Time to build something awesome!</p>
                <button onClick={() => router.push('/create-project')} className="px-8 py-3 bg-[#006b5b] text-white font-bold rounded-lg hover:bg-[#005a4d] transition flex items-center gap-2 mx-auto">
                    <PlusCircle className="w-5 h-5" /> Create Your First Project
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#0c1d1a]">My Projects ({projects.length})</h2>
                <button onClick={() => router.push('/create-project')} className="px-4 py-2 bg-[#006b5b] text-white text-sm font-medium rounded-lg hover:bg-[#005a4d] transition flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> New Project
                </button>
            </div>

            <div className="grid gap-5">
                {projects.map((project) => (
                    <div key={project._id} className="bg-white border border-[#e6f4f2] rounded-xl p-6 hover:shadow-lg transition-shadow relative">

                        {/* Three-dot menu */}
                        <div className="absolute top-3 right-3 z-50">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenuId(showMenuId === project._id ? null : project._id);
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                aria-label="More options"
                            >
                                <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>

                            {showMenuId === project._id && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowMenuId(null)}
                                    />

                                    {/* Actual Menu */}
                                    <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditProject(project._id);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                            Edit Project
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDisableProject(project._id);
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

                        {/* Main content */}
                        <div className="pr-10">
                            <div className="flex items-center gap-4 mb-3">
                                <h3
                                    onClick={() => router.push(`/project-details/${project._id}`)}
                                    className="text-xl font-bold text-[#0c1d1a] hover:text-[#006b5b] cursor-pointer transition"
                                >
                                    {project._title}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project._status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {project._status === 'active' ? 'Active' : 'Completed'}
                                </span>
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
                                        <span key={tech} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-200">
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
                                    {project._members?.length || 0} member{project._members?.length !== 1 ? 's' : ''}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(project._createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
        </div>
    );
}