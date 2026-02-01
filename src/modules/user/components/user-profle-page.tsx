'use client';

import { useEffect, useState } from "react";
import { Header } from "@/shared/common/user-common/Header";
import PageLoader from "@/shared/common/LoadingComponent";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  FileText,
  PlusCircle,
  User,
  Briefcase,
  GitBranch,
  Camera
} from "lucide-react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import api from "@/lib/axios";
import { MyProjectsTab } from "@/modules/projects/components/my-projects.page";
import { AppliedProjectsTab } from "@/modules/projects/components/applied-project";
import { BackButton } from "@/shared/common/BackButton";

interface User {
  name: string;
  username?: string;
  role?: string;
  profileImage?: string;
  bio?: string;
  title?: string;
  techStack?: string[];
  createdProjectsCount?: number;
  contributionsCount?: number;
  recentActivities?: { type: string; title: string; timestamp: string }[];
}

export default function UserProfilePage() {
  const { user, loading, error } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"overview" | "my-projects" | "applied">("overview");
  const router = useRouter();


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { data } = await api.get('/api/profile/me', { withCredentials: true });
  //     } catch (error) {
  //       let err = error as Error
  //       console.error(err.message);
  //     }
  //   };
  //   fetchData();
  // }, [])



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <Header />

      <main className="flex-1 pt-20 px-4 md:px-8 lg:px-40">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          {user && !loading && (
            <>
              <div className="flex flex-col items-center mb-10">
                {/* Profile Image */}
                <div className="relative inline-block mb-6 group">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-2xl bg-gradient-to-br from-[#d4a373] to-[#e6b800]/30">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#d4a373]/90">
                        <User className="w-20 h-20 text-white" />
                      </div>
                    )}
                  </div>
                  <div
                    onClick={() => router.push("/edit-profile")}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="w-12 h-12 text-white drop-shadow-lg" />
                    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Change Photo
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-[#0c1d1a] text-2xl font-bold">{user.name}</h1>
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <p className="text-[#45a193] text-sm mb-1">
                  @{user.name || user.name.toLowerCase().replace(" ", "")}
                </p>

                {user.title && (
                  <p className="text-[#45a193] text-sm mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {user.title}
                  </p>
                )}

                <button
                  onClick={() => router.push("/edit-profile")}
                  className="px-8 py-2 bg-[#006b5b] text-white text-sm font-bold rounded hover:bg-[#005a4d] transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              {/* TABS */}
              <div className="flex gap-8 mb-6 border-b border-[#e6f4f2] overflow-x-auto">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`whitespace-nowrap text-sm pb-3 border-b-2 transition-all ${activeTab === "overview"
                    ? "text-[#0c1d1a] font-semibold border-[#0c1d1a]"
                    : "text-[#45a193] font-medium hover:text-[#006b5b]"
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("my-projects")}
                  className={`whitespace-nowrap text-sm pb-3 border-b-2 transition-all ${activeTab === "my-projects"
                    ? "text-[#0c1d1a] font-semibold border-[#0c1d1a]"
                    : "text-[#45a193] font-medium hover:text-[#006b5b]"
                    }`}
                >
                  My Projects
                </button>
                <button
                  onClick={() => setActiveTab("applied")}
                  className={`whitespace-nowrap text-sm pb-3 border-b-2 transition-all ${activeTab === "applied"
                    ? "text-[#0c1d1a] font-semibold border-[#0c1d1a]"
                    : "text-[#45a193] font-medium hover:text-[#006b5b]"
                    }`}
                >
                  Applied Projects
                </button>
              </div>

              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <>
                  {user.bio ? (
                    <p className="text-[#0c1d1a] text-center text-base leading-relaxed mb-8">
                      {user.bio}
                    </p>
                  ) : (
                    <p className="text-[#9ca3af] text-center text-sm italic mb-8">
                      No bio yet. Add one in Edit Profile!
                    </p>
                  )}

                  {user.techStack && user.techStack.length > 0 ? (
                    <div className="flex justify-center flex-wrap gap-2 mb-8">
                      {user.techStack.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-[#e6f4f2] text-[#0c1d1a] text-sm font-medium rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#9ca3af] text-center text-sm italic mb-8">
                      No skills added yet. Add them in Edit Profile!
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 border border-[#e6f4f2] rounded-lg text-center">
                      <p className="text-[#0c1d1a] text-3xl font-bold mb-1">{user.createdProjectsCount || 0}</p>
                      <p className="text-[#45a193] text-sm">Created Projects</p>
                    </div>
                    <div className="p-6 border border-[#e6f4f2] rounded-lg text-center">
                      <p className="text-[#0c1d1a] text-3xl font-bold mb-1">{user.contributionsCount || 0}</p>
                      <p className="text-[#45a193] text-sm">Contributions</p>
                    </div>
                  </div>

                  {/* Activity Timeline with Lucide */}
                  <div className="mb-12">
                    <h2 className="text-[#0c1d1a] text-xl font-bold mb-6">Activity Timeline</h2>
                    <div className="space-y-8">
                      {user.recentActivities && user.recentActivities.length > 0 ? (
                        user.recentActivities.map((activity, i) => {
                          const isProject = activity.type === 'project_created';
                          const Icon = isProject ? FolderOpen : FileText;
                          const bg = isProject ? "bg-[#006b5b]" : "bg-green-600";

                          return (
                            <div key={i} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                {i < (user.recentActivities?.length || 0) - 1 && <div className="w-0.5 h-16 bg-[#e6f4f2]" />}
                              </div>
                              <div className="flex-1 pt-1">
                                <p className="text-[#0c1d1a] font-semibold text-sm mb-1">{activity.title}</p>
                                <p className="text-[#45a193] text-xs">
                                  {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[#9ca3af] text-sm italic">No recent activity to show.</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* MY PROJECTS */}
              {activeTab === "my-projects" && <MyProjectsTab />}

              {/* APPLIED PROJECTS */}
              {activeTab === "applied" && <AppliedProjectsTab />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}