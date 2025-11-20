'use client';

import { useEffect, useState } from "react";
import { Header } from "@/shared/common/user-common/Header";
import { userProfile } from "../services/user.api";
import { getErrorMessage } from "@/shared/utils/ErrorMessage";
import PageLoader from "@/shared/common/LoadingComponent";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  username?: string;
  role?: string;
  // add other fields you expect
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userProfile();
      setUser(res.data);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      console.error("Failed to load profile:", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);


  
    if (loading)
      return (
        <div className="flex items-center justify-center min-h-screen">
          <PageLoader />
        </div>
      );
  

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <Header user={{ name: user?.name || "Guest" }} />

      <main className="flex-1 pt-20 px-4 md:px-8 lg:px-40">
        <div className="max-w-4xl mx-auto">

          {/* Profile Content */}
          {user && !loading && (
            <>
              <div className="flex flex-col items-center mb-10">
                <div className="w-32 h-32 rounded-full bg-[#d4a373] overflow-hidden mb-4">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23d4a373' width='100' height='100'/%3E%3Ccircle cx='50' cy='35' r='18' fill='%23000'/%3E%3Cellipse cx='50' cy='75' rx='30' ry='25' fill='%23000'/%3E%3C/svg%3E"
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
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

                <p className="text-[#45a193] text-sm mb-1">@{user.name || "user"}</p>
                <p className="text-[#45a193] text-sm mb-4">{user.title || "Software Engineer"}</p>

                <button onClick={()=>router.push("/edit-profile")} className="px-8 py-2 bg-[#006b5b] text-white text-sm font-bold rounded hover:bg-[#005a4d] transition-colors">
                  Edit Profile
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-8 mb-6 border-b border-[#e6f4f2] overflow-x-auto">
                <button className="whitespace-nowrap text-[#0c1d1a] text-sm font-semibold pb-3 border-b-2 border-[#0c1d1a]">
                  Overview
                </button>
                <button className="whitespace-nowrap text-[#45a193] text-sm font-medium pb-3 hover:text-[#006b5b]">
                  My Projects
                </button>
                <button className="whitespace-nowrap text-[#45a193] text-sm font-medium pb-3 hover:text-[#006b5b]">
                  Applied Projects
                </button>
              </div>

              {/* Bio */}
              <p className="text-[#0c1d1a] text-center text-base leading-relaxed mb-8">
                Passionate software engineer with a focus on building scalable and user-friendly
                applications. Experienced in full-stack development and open to new collaborations.
              </p>

              {/* Skills */}
              <div className="flex justify-center flex-wrap gap-2 mb-8">
                {["JavaScript", "React", "Node.js", "Python", "SQL"].map((s) => (
                  <span
                    key={s}
                    className="px-4 py-2 bg-[#e6f4f2] text-[#0c1d1a] text-sm font-medium rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="p-6 border border-[#e6f4f2] rounded-lg text-center">
                  <p className="text-[#0c1d1a] text-3xl font-bold mb-1">12</p>
                  <p className="text-[#45a193] text-sm">Created Projects</p>
                </div>
                <div className="p-6 border border-[#e6f4f2] rounded-lg text-center">
                  <p className="text-[#0c1d1a] text-3xl font-bold mb-1">45</p>
                  <p className="text-[#45a193] text-sm">Contributions</p>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="mb-12">
                <h2 className="text-[#0c1d1a] text-xl font-bold mb-6">Activity Timeline</h2>
                <div className="space-y-8">
                  {[
                    {
                      icon: <FileIcon />,
                      bg: "bg-green-600",
                      title: "Joined Project: OpenSourceApp",
                      time: "3 months ago",
                    },
                    {
                      icon: <PlusIcon />,
                      bg: "bg-[#0c1d1a]",
                      title: "Contributed to Project: DataVizLib",
                      time: "6 months ago",
                    },
                    {
                      icon: <FolderIcon />,
                      bg: "bg-[#006b5b]",
                      title: "Created Project: WebToolKit",
                      time: "1 year ago",
                    },
                  ].map((a, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ${a.bg} flex items-center justify-center flex-shrink-0`}>
                          {a.icon}
                        </div>
                        {i < 2 && <div className="w-0.5 h-16 bg-[#e6f4f2]" />}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-[#0c1d1a] font-semibold text-sm mb-1">{a.title}</p>
                        <p className="text-[#45a193] text-xs">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// Reusable Icons
const FileIcon = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
  </svg>
);

