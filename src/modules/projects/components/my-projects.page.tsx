'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen, PlusCircle, Users, Calendar, ExternalLink } from 'lucide-react';
import api from '@/lib/axios';
import PageLoader from '@/shared/common/LoadingComponent';
import { getMyCreatedProject } from '../services/project.api';
import { getErrorMessage } from '@/shared/utils/ErrorMessage';

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
  const router = useRouter();

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        setLoading(true);
        const { data } = await getMyCreatedProject()
        console.log("My created projects:", data);
        setProjects(data);
      } catch (err) {
        getErrorMessage(err)
        setError('Failed to load your projects');
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <PageLoader />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#006b5b] text-white rounded-lg hover:bg-[#005a4d] transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
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
          <PlusCircle className="w-5 h-5" />
          Create Your First Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0c1d1a]">
        My Projects ({projects.length})
      </h2>

      <div className="grid gap-5">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white border border-[#e6f4f2] rounded-xl p-6 hover:shadow-lg transition-all duration-200"
          >
            {/* Header: Title + Status + Link Icon */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3
                    onClick={() => router.push(`/project/${project._id}`)}
                    className="text-xl font-bold text-[#0c1d1a] hover:text-[#006b5b] cursor-pointer transition-colors"
                  >
                    {project._title}
                  </h3>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      project._status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {project._status === 'active' ? 'Active' : 'Completed'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {project._description}
                </p>

                {/* Tech Stack */}
                {project._techStack && project._techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project._techStack.map((tech) => (
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

              <ExternalLink
                onClick={() => router.push(`/project-details/${project._id}`)}
                className="w-5 h-5 text-[#45a193] cursor-pointer hover:text-[#006b5b] ml-4 flex-shrink-0"
              />
            </div>

            {/* Footer: Members + Date + Dashboard Button */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>
                    {project._members?.length || 0} member{project._members?.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project._createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push(`/creator-dashboard?projectId=${project._id}`)}
                className="px-5 py-2.5 bg-[#006b5b] text-white font-medium rounded-lg hover:bg-[#005a4d] transition flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Creator Dashboard
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}