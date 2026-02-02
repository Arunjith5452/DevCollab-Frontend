"use client"

import { Header } from "@/shared/common/user-common/Header";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { projectDetails } from "../services/project.api";
import { getErrorMessage } from "@/shared/utils/ErrorMessage";
import PageLoader from "@/shared/common/LoadingComponent";
import { ProjectDetails } from "../types/project.types";

import { useProjectStore } from "@/store/useProjectStore";
import { RequiredRole } from "../types/project.types";
import { BackButton } from "@/shared/common/BackButton";

export default function ProjectDetailsPage() {

  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [project, setProjectData] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { setProject } = useProjectStore();

  useEffect(() => {

    const fetchProject = async () => {
      try {
        if (!id) return;
        const res = await projectDetails(id)
        if (res.data) {
          setProjectData(res.data);
          setProject({ id: res.data.id, title: res.data.title });
        }
      } catch (error) {
        const message = getErrorMessage(error)
        console.error(message)
      } finally {
        setLoading(false);
      }
    }

    fetchProject()

  }, [id, setProject])


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageLoader />
      </div>
    );

  if (!project) {
    return <div className="flex justify-center py-20 text-gray-500">Project not found.</div>;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-40 py-8 mt-20">
        <div className="max-w-5xl mx-auto">
          <BackButton />
          {/* Hero Image */}
          <div className="w-full h-56 sm:h-64 rounded-lg overflow-hidden mb-6">
            {project.image ? (
              <img
                src={project.image}
                alt={`Image for ${project.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-gray-300">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="ml-3 text-gray-500 font-medium">No Project Image</span>
              </div>
            )}
          </div>
          {/* Project Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[#0c1d1a] text-2xl sm:text-3xl font-bold">
                {project.title}
              </h1>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                {project.status}
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                {project.difficulty}
              </span>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full self-start sm:self-auto">
              {project.visibility}
            </span>
          </div>

          <p className="text-[#6b7280] text-sm mb-6">
            Building the future of collaborative development.
          </p>

          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-[#0c1d1a] text-xl font-bold mb-3">About This Project</h2>
            <p className="text-[#0c1d1a] text-base leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Project Creator */}
          <div className="mb-8">
            <h3 className="text-[#0c1d1a] text-lg font-semibold mb-3">Project Creator</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#d4a373] overflow-hidden flex items-center justify-center">
                {project.creator?.avatar ? (
                  <img
                    src={project.creator.avatar}
                    alt={project.creator.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#d4a373] to-[#b5835a] flex items-center justify-center text-white font-bold">
                    {project.creator?.name?.charAt(0).toUpperCase() || "C"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[#0c1d1a] font-semibold text-sm">{project.creator?.name || "Anonymous Member"}</p>
                <p className="text-[#6b7280] text-xs">Project Lead</p>
              </div>
            </div>
          </div>

          {/* Project Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 p-6 bg-[#f8fcfb] rounded-lg border border-[#e6f4f2]">
            {(() => {
              const totalTeamSize = project.requiredRoles?.reduce(
                (sum: number, role: RequiredRole) => sum + Number(role.count || 0),
                0
              );

              return [
                ["Team Size", `${totalTeamSize} Members`],
                ["Difficulty Level", project.difficulty || "N/A"],
                ["Start Date", new Date(project.startDate).toDateString()],
                ["End Date", new Date(project.endDate).toDateString()],
                ["Status", project.status || "N/A"],
                ["Visibility", project.visibility || "N/A"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[#6b7280] text-sm mb-1">{label}</p>
                  <p className="text-[#0c1d1a] text-base font-semibold">{value}</p>
                </div>
              ));
            })()}
          </div>



          {/* GitHub Repository */}
          <div className="mb-8">
            <h3 className="text-[#0c1d1a] text-lg font-semibold mb-3">Repository</h3>
            <a
              href="#"
              className="flex items-center gap-2 text-[#006b5b] hover:text-[#005a4d] text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12..." />
              </svg>
              {project.githubRepo}
            </a>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-[#0c1d1a] text-lg font-semibold mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech: string) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-[#f3f4f6] text-[#0c1d1a] text-sm font-medium rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Required Roles */}
          <div className="mb-8">
            <h3 className="text-[#0c1d1a] text-lg font-semibold mb-3">
              Required Roles
            </h3>
            <div className="space-y-3">
              {project.requiredRoles?.map((role: RequiredRole, index: number) => (
                <div
                  key={role._id || index}
                  className="p-4 bg-white border border-[#e6f4f2] rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[#0c1d1a] font-semibold">{role.role}</p>
                    <span className="px-2 py-1 bg-[#e6f4f2] text-[#006b5b] text-xs font-medium rounded">
                      {role.count} needed
                    </span>
                  </div>
                  <p className="text-[#6b7280] text-sm">
                    Experience: {role.experience}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Expectations */}
          <div className="mb-8">
            <h2 className="text-[#0c1d1a] text-xl font-bold mb-3">Expectations</h2>
            <p className="text-[#0c1d1a] text-base leading-relaxed">
              {project.expectation}
            </p>
          </div>

          {/* Apply Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                router.push(`/apply-project?projectId=${id}&tech=${encodeURIComponent(JSON.stringify(project.techStack))}`);
              }}
              className="px-8 py-3 bg-[#006b5b] text-white text-base font-bold rounded hover:bg-[#005a4d] transition-colors"
            >
              Apply to Join This Project
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}
