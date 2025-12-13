"use client"

import { Header } from "@/shared/common/user-common/Header";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { projectDetails } from "../services/project.api";
import { getErrorMessage } from "@/shared/utils/ErrorMessage";
import PageLoader from "@/shared/common/LoadingComponent";
import { ProjectDetails } from "../types/project.types";
import api from "@/lib/axios";

export default function ProjectDetailsPage() {

  const router = useRouter()


  const { id } = useParams<{ id: string }>()

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {

    const fetchProject = async () => {
      try {
        if (!id) return;
        const data = await projectDetails(id)
        setProject(data.data)
      } catch (error) {
        let message = getErrorMessage(error)
        console.error(message)
      } finally {
        setLoading(false);
      }
    }

    fetchProject()

  }, [id])


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
      <Header/>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-40 py-8 mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Image */}
          <div className="w-full h-56 sm:h-64 rounded-lg overflow-hidden mb-6">
            {project._image ? (
              <img
                src={project._image}
                alt={`Image for ${project._title}`}
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
                {project._title}
              </h1>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                {project._status}
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                {project._difficulty}
              </span>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full self-start sm:self-auto">
              {project._visibility}
            </span>
          </div>

          <p className="text-[#6b7280] text-sm mb-6">
            A collaborative platform for developers to build and launch innovative web applications.
          </p>

          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-[#0c1d1a] text-xl font-bold mb-3">About This Project</h2>
            <p className="text-[#0c1d1a] text-base leading-relaxed">
              {project._description}
            </p>
          </div>

          {/* Project Creator */}
          <div className="mb-8">
            <h3 className="text-[#0c1d1a] text-lg font-semibold mb-3">Project Creator</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#d4a373] overflow-hidden">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23d4a373' width='100' height='100'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23fff'/%3E%3Cellipse cx='50' cy='75' rx='25' ry='20' fill='%23fff'/%3E%3C/svg%3E"
                  alt="Sophia Bennett"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[#0c1d1a] font-semibold text-sm">Sophia Bennett</p>
                <p className="text-[#6b7280] text-xs">Project Lead</p>
              </div>
            </div>
          </div>

          {/* Project Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 p-6 bg-[#f8fcfb] rounded-lg border border-[#e6f4f2]">
            {(() => {
              const totalTeamSize = project._requiredRoles?.reduce(
                (sum: number, role: any) => sum + Number(role.count || 0),
                0
              );

              return [
                ["Team Size", `${totalTeamSize} Members`],
                ["Difficulty Level", project._difficulty || "N/A"],
                ["Start Date", new Date(project._startDate).toDateString()],
                ["End Date", new Date(project._endDate).toDateString()],
                ["Status", project._status || "N/A"],
                ["Visibility", project._visibility || "N/A"],
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
              {project._githubRepo}
            </a>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-[#0c1d1a] text-lg font-semibold mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project._techStack?.map((tech: string) => (
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
              {project._requiredRoles?.map((role: any) => (
                <div
                  key={role._id}
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
              {project._expectation}
            </p>
          </div>

          {/* Apply Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                router.push(`/apply-project?projectId=${id}&tech=${encodeURIComponent(JSON.stringify(project._techStack))}`);
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
