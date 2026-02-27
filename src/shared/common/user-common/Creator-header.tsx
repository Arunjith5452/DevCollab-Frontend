"use client";

import { useAuthStore } from "@/store/useUserStore";
import { User } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { projectDetails } from "@/modules/projects/services/project.api";
import { useProjectStore } from "@/store/useProjectStore";

interface HeaderProps {
    projectName?: string;
}

export default function CreatorHeader({ projectName: propProjectName }: HeaderProps) {
    const { user, fetchUser } = useAuthStore();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");
    const { currentProject, setProject } = useProjectStore();

    useEffect(() => {
        if (!user) fetchUser();
    }, [fetchUser, user]);

    useEffect(() => {
        if (!propProjectName && projectId && projectId !== 'null' && (!currentProject || currentProject.id !== projectId)) {
            projectDetails(projectId)
                .then(res => {
                    setProject({ id: res.data.id, title: res.data.title });
                })
                .catch(err => console.error("Header failed to fetch project name", err));
        }
    }, [propProjectName, projectId, currentProject, setProject]);

    const displayProjectName = propProjectName || (currentProject?.id === projectId ? currentProject?.title : "") || "Project";

    return (
        <header className="bg-white border-b border-[#e6f4f2] px-4 sm:px-6 md:px-10 py-4 flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-[#6b7280]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    <span className="text-[#0c1d1a] font-semibold text-base">{displayProjectName}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                        {user?.name || "Creator"}
                    </p>
                    <p className="text-[10px] font-medium text-[#006b5b] uppercase tracking-wider">
                        Project Creator
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a373] to-[#b5835a] overflow-hidden shadow-sm border border-[#e6f4f2] flex items-center justify-center">
                    {user?.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-5 h-5 text-white" />
                    )}
                </div>
            </div>
        </header>
    );
}