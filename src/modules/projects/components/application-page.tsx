"use client";

import { useState, useEffect } from "react";
import CreatorHeader from "@/shared/common/user-common/Creator-header";
import { CreatorSidebar } from "@/shared/common/user-common/Creator-sidebar";
import { Eye, Link2, Check, X, Github } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { approveApplication, getPendingApplications, rejectApplication } from "../services/project.api";
import { PendingApplication } from "../types/project.types";
import api from "@/lib/axios";

export default function ApplicationsPage() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/api/profile/me', { withCredentials: true });
            } catch (error) {
                let err = error as Error
                console.error(err.message);
            }
        };
        fetchData();
    }, [])

    const [applications, setApplications] = useState<PendingApplication[]>([]);
    const [selectedApplicant, setSelectedApplicant] = useState<PendingApplication | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        if (!projectId) return;
        setLoading(true);
        try {
            const data = await getPendingApplications(projectId);
            setApplications(data);
        } catch (err) {
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchApplications();
    }, [projectId]);

    const openModal = (app: PendingApplication) => setSelectedApplicant(app);
    const closeModal = () => setSelectedApplicant(null);

    // Approve handler
    const handleApprove = async () => {
        if (!selectedApplicant || !projectId) return;

        try {
            await approveApplication(selectedApplicant.id, projectId);
            toast.success("Application approved!");
            setApplications(prev => prev.filter(a => a.id !== selectedApplicant.id));
            closeModal();
        } catch (err) {
        }
    };

    // Reject handler
    const handleReject = async () => {
        if (!selectedApplicant) return;
        try {
            await rejectApplication(selectedApplicant.id);
            toast.success("Application rejected");
            setApplications(prev => prev.filter(a => a.id !== selectedApplicant.id));
            closeModal();
        } catch (err) {
            console.log("error", err)
        }
    };

    // AI Suggested Contributors
    const suggestedContributors = [
        { name: "Ethan Hager", role: "UX/UI Designer", linkedin: "LINKEDIN-LINK", bgColor: "#d4a373" },
        { name: "Natalie Low", role: "Product Manager", linkedin: "LINKEDIN-LINK", bgColor: "#ffc0a0" },
        { name: "Liam Hansen", role: "Software Engineer", linkedin: "LINKEDIN-LINK", bgColor: "#d4c4a0" },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <CreatorSidebar activeItem="applications" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <CreatorHeader projectName="Project Alpha" />

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="p-8">
                        <h1 className="text-[#0c1d1a] text-2xl font-bold mb-8">Applications</h1>

                        {/* Loading State */}
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Loading applications...</div>
                        ) : applications.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">No pending applications</div>
                        ) : (
                            <div className="mb-12">
                                <div className="bg-white rounded-lg border border-[#e6f4f2] overflow-hidden">
                                    <div className="grid grid-cols-12 gap-6 px-6 py-3 bg-[#f8f9fa] border-b border-[#e6f4f2]">
                                        <div className="col-span-3 text-center">
                                            <p className="text-[#6b7280] text-xs font-medium">Contributor</p>
                                        </div>
                                        <div className="col-span-3 text-center">
                                            <p className="text-[#6b7280] text-xs font-medium">Name</p>
                                        </div>
                                        <div className="col-span-3 text-center">
                                            <p className="text-[#6b7280] text-xs font-medium">Portfolio Link</p>
                                        </div>
                                        <div className="col-span-3 text-center">
                                            <p className="text-[#6b7280] text-xs font-medium">View Details</p>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-[#e6f4f2]">
                                        {applications.map((app) => (
                                            <div
                                                key={app.id}
                                                className="grid grid-cols-12 gap-6 px-6 py-4 items-center hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                                                onClick={() => openModal(app)}
                                            >
                                                <div className="col-span-3 flex justify-center">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden shadow-md relative">
                                                        {app.user.profileImage ? (
                                                            <img
                                                                src={app.user.profileImage}
                                                                alt={app.user.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = "none";
                                                                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div
                                                            className={`absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm ${app.user.profileImage ? "hidden" : ""}`}
                                                        >
                                                            {app.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-3 text-center">
                                                    <p className="text-[#0c1d1a] text-sm font-medium">{app.user.name}</p> {/* ← Fixed */}
                                                </div>
                                                <div className="col-span-3 text-center">
                                                    <a
                                                        href={app.profileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#45a193] text-sm hover:text-[#006b5b] hover:underline"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        View Portfolio
                                                    </a>
                                                </div>
                                                <div className="col-span-3 flex justify-center">
                                                    <button className="text-[#006b5b] hover:text-[#004d40] transition-colors">
                                                        <Eye size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Suggested Contributors */}
                        <div>
                            <h2 className="text-[#0c1d1a] text-xl font-bold mb-6">AI Suggested Contributors</h2>
                            <div className="grid grid-cols-3 gap-6">
                                {suggestedContributors.map((contrib, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-lg border border-[#e6f4f2] p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div
                                            className="w-36 h-36 rounded-full overflow-hidden mb-4 flex items-center justify-center text-white text-3xl font-bold"
                                            style={{ backgroundColor: contrib.bgColor }}
                                        >
                                            {contrib.name.split(" ").map((n) => n[0]).join("")}
                                        </div>
                                        <h3 className="text-[#0c1d1a] font-semibold mb-1">{contrib.name}</h3>
                                        <p className="text-[#6b7280] text-xs mb-1">{contrib.linkedin}</p>
                                        <p className="text-[#6b7280] text-xs mb-4">{contrib.role}</p>
                                        <button className="text-[#006b5b] text-sm font-medium hover:text-[#005a4d]">
                                            [View Suggested]
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MODAL — WITH REAL DATA */}
                    {selectedApplicant && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-white/80 backdrop-blur-sm"
                                onClick={closeModal}
                            />

                            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
                                <div className="flex items-start gap-6 mb-8">
                                    <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                                        {selectedApplicant.user.profileImage ? (
                                            <img
                                                src={selectedApplicant.user.profileImage}
                                                alt={selectedApplicant.user.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`w-full h-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold ${selectedApplicant.user.profileImage ? "hidden" : ""
                                                }`}
                                        >
                                            {selectedApplicant.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedApplicant.user.name}</h2>
                                            <svg className="w-7 h-7 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                        </div>
                                        <p className="text-teal-600 font-medium mt-1">Contributor</p>
                                    </div>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-8">
                                    {selectedApplicant.user.bio}
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-8">
                                    Applied with skills: {selectedApplicant.techStack.join(", ")}
                                </p>

                                <div className="flex items-center gap-8 mb-8 text-gray-600">
                                    {selectedApplicant.user.github && (
                                        <a href={selectedApplicant.user.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-teal-600 transition">
                                            <Github size={20} />
                                            <span className="text-sm">GitHub Profile</span>
                                        </a>
                                    )}
                                    <a href={selectedApplicant.profileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-teal-600 transition">
                                        <Link2 size={20} />
                                        <span className="text-sm">Portfolio</span>
                                    </a>
                                </div>

                                <div className="mb-10">
                                    <h3 className="font-bold text-gray-900 mb-3">Why do you want to join this project?</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {selectedApplicant.reason}
                                    </p>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={handleApprove}
                                        className="px-8 py-3 bg-teal-500 text-white font-medium rounded-full hover:bg-teal-600 transition shadow-md flex items-center gap-2"
                                    >
                                        <Check size={18} />
                                        Approve
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="px-8 py-3 bg-white text-red-600 font-medium rounded-full border-2 border-red-500 hover:bg-red-50 transition flex items-center gap-2"
                                    >
                                        <X size={18} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}