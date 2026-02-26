'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Clock, CheckCircle, XCircle, Calendar, ExternalLink } from 'lucide-react';
import PageLoader from '@/shared/common/LoadingComponent';
import { getMyAppliedProject } from '../services/project.api';
import { Pagination } from '@/shared/common/Pagination';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  image?: string;
  difficulty: string;
  githubRepo?: string;
}

interface AppliedProject {
  _id: string;
  _projectId: Project;
  _reason: string;
  _status: 'pending' | 'approved' | 'rejected';
  _createdAt: string;
  _techStack: string[];
}

export function AppliedProjectsTab() {
  const [applications, setApplications] = useState<AppliedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;
  const router = useRouter();

  const fetchAppliedProjects = async () => {
    try {
      setLoading(true);
      const data = (await getMyAppliedProject(currentPage, itemsPerPage)) as { applications: AppliedProject[]; total: number };
      setApplications(data.applications);
      setTotalItems(data.total);
    } catch (err) {
      setError('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedProjects();
  }, [currentPage]);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { icon: React.ElementType; bg: string; text: string; label: string }> = {
      pending: { icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <PageLoader />
      </div>
    );
  }

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

  if (applications.length === 0) {
    return (
      <div className="text-center py-24">
        <FileText className="w-20 h-20 mx-auto mb-6 text-[#45a193]/20" />
        <h3 className="text-2xl font-bold text-[#0c1d1a] mb-2">No Applications Yet</h3>
        <p className="text-gray-600 mb-8">Browse projects and apply to join awesome teams!</p>
        <button
          onClick={() => router.push('/project-list')}
          className="px-8 py-3 bg-[#006b5b] text-white font-bold rounded-lg hover:bg-[#005a4d] transition"
        >
          Explore Projects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0c1d1a]">
        My Applications ({applications.length})
      </h2>

      <div className="grid gap-5">
        {applications.map((app) => {
          const project = app._projectId;

          return (
            <div
              key={app._id}
              className="bg-white border border-[#e6f4f2] rounded-xl p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3
                      onClick={() => router.push(`/project/${project._id}`)}
                      className="text-xl font-bold text-[#0c1d1a] hover:text-[#006b5b] cursor-pointer transition-colors"
                    >
                      {project.title}
                    </h3>
                    {getStatusBadge(app._status)}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* Tech Stack Chips */}
                  {app._techStack && app._techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {app._techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-200"
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

              {/* Info Grid - Only Reason & Applied Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f8f9fa] p-4 rounded-lg text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Your Reason</p>
                  <p className="font-medium text-[#0c1d1a] line-clamp-2" title={app._reason}>
                    {app._reason || 'No reason provided'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Applied On</p>
                  <p className="font-medium text-[#0c1d1a] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(app._createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Bottom Status / Action */}
              <div className="mt-5 flex justify-between items-center">
                <div>
                  {app._status === 'pending' && (
                    <span className="text-[#45a193] text-sm font-medium">
                      Awaiting response...
                    </span>
                  )}
                  {app._status === 'rejected' && (
                    <span className="text-red-600 text-sm font-medium">
                      Application rejected
                    </span>
                  )}
                </div>

                {app._status === 'approved' && (
                  <button
                    onClick={() => router.push(`/contributor-dashboard?projectId=${project._id}`)}
                    className="px-5 py-2.5 bg-[#006b5b] text-white font-medium rounded-lg hover:bg-[#005a4d] transition flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Contributor Dashboard
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
    </div>
  );
}