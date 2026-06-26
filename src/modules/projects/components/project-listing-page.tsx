"use client";
import React, { useEffect, useState, useRef } from 'react';
import {
  Search, SlidersHorizontal, ChevronDown, X,
  MapPin, Clock, Briefcase, Code2, ShieldAlert,
  ArrowRight, Users, LayoutGrid, CheckCircle2,
  FolderDot
} from 'lucide-react';
import { Header } from '@/shared/common/user-common/Header';
import { Pagination } from '@/shared/common/admin-common';
import { listProject } from '../services/project.api';
import { ListProjectResponse, Project } from '../types/project.types';
import Link from 'next/link';
import PageLoader from '@/shared/common/LoadingComponent';
import { formatDistanceToNow } from 'date-fns';
import { useDebounce } from '@/shared/hooks/useDebounce';

/* ── Standard UI Constants ───────────────────────────── */
const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  intermediate: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  advanced: 'bg-purple-50 text-purple-700 ring-purple-600/20',
};

const TECH_OPTIONS = ['React', 'Node.js', 'Python', 'TypeScript', 'Next.js', 'Vue', 'Flutter', 'Django'];
const ROLE_OPTIONS = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'DevOps Engineer'];
const DIFF_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

export default function ExploreProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);

  // Filters
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  
  // Custom input states
  const [customTech, setCustomTech] = useState('');
  const [isCustomTech, setIsCustomTech] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounced Values
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedCustomTech = useDebounce(customTech, 500);
  const debouncedCustomRole = useDebounce(customRole, 500);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const rawTech = [...selectedTech, ...(isCustomTech && debouncedCustomTech ? [debouncedCustomTech] : [])];
        const finalTech = rawTech.map(t => t.replace(/\.js$/i, ''));
        const finalRole = [...selectedRole, ...(isCustomRole && debouncedCustomRole ? [debouncedCustomRole] : [])];

        const data: ListProjectResponse = await listProject({
          search: debouncedSearch,
          techStack: finalTech.length > 0 ? finalTech.join(',') : undefined,
          difficulty: selectedDifficulty.length > 0 ? selectedDifficulty.join(',') : undefined,
          roleNeeded: finalRole.length > 0 ? finalRole.join(',') : undefined,
          page: currentPage,
        });
        setProjects(data.projects ?? []);
        setTotalPages(data.total ?? 1);
      } catch {
        setProjects([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [debouncedSearch, selectedTech, selectedDifficulty, selectedRole, debouncedCustomTech, debouncedCustomRole, isCustomTech, isCustomRole, currentPage]);

  const toggleFilter = (setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setState(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedTech([]);
    setSelectedDifficulty([]);
    setSelectedRole([]);
    setCustomTech('');
    setCustomRole('');
    setIsCustomTech(false);
    setIsCustomRole(false);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const activeFilterCount = selectedTech.length + selectedDifficulty.length + selectedRole.length + (isCustomTech ? 1 : 0) + (isCustomRole ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="pt-24 pb-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Project Directory</h1>
            <p className="mt-2 text-gray-500 text-sm">Discover and contribute to open-source initiatives across the globe.</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-shadow shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── Left Sidebar: Filters ── */}
          <div className={`lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-28 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-xs font-medium text-red-600 hover:text-red-700">
                    Clear all
                  </button>
                )}
              </div>

              {/* Technology Filter */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Technology</h3>
                <div className="space-y-2.5">
                  {TECH_OPTIONS.map(tech => (
                    <label key={tech} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedTech, tech)}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${selectedTech.includes(tech) ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white group-hover:border-green-500'}`}>
                        {selectedTech.includes(tech) && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{tech}</span>
                    </label>
                  ))}
                  
                  {/* Custom Tech */}
                  <label className="flex items-center gap-3 cursor-pointer group" onClick={() => { setIsCustomTech(!isCustomTech); setCurrentPage(1); }}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${isCustomTech ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white group-hover:border-green-500'}`}>
                      {isCustomTech && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Other</span>
                  </label>
                  {isCustomTech && (
                    <div className="pl-7 mt-2">
                      <input 
                        type="text" 
                        placeholder="e.g. Go, Rust..." 
                        value={customTech}
                        onChange={(e) => {
                          setCustomTech(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-100 my-6" />

              {/* Role Filter */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Role Needed</h3>
                <div className="space-y-2.5">
                  {ROLE_OPTIONS.map(role => (
                    <label key={role} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedRole, role)}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${selectedRole.includes(role) ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white group-hover:border-green-500'}`}>
                        {selectedRole.includes(role) && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{role}</span>
                    </label>
                  ))}
                  
                  {/* Custom Role */}
                  <label className="flex items-center gap-3 cursor-pointer group" onClick={() => { setIsCustomRole(!isCustomRole); setCurrentPage(1); }}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${isCustomRole ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white group-hover:border-green-500'}`}>
                      {isCustomRole && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Other Role</span>
                  </label>
                  {isCustomRole && (
                    <div className="pl-7 mt-2">
                      <input 
                        type="text" 
                        placeholder="e.g. Product Manager" 
                        value={customRole}
                        onChange={(e) => {
                          setCustomRole(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-100 my-6" />

              {/* Difficulty Filter */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Difficulty</h3>
                <div className="space-y-2.5">
                  {DIFF_OPTIONS.map(diff => (
                    <label key={diff} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedDifficulty, diff)}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${selectedDifficulty.includes(diff) ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white group-hover:border-green-500'}`}>
                        {selectedDifficulty.includes(diff) && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{diff}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
            <span className="font-medium text-gray-700">Filter Projects</span>
            <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="p-2 bg-gray-50 rounded-md border border-gray-200">
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* ── Right Content: Project List ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="py-20 flex justify-center">
                <PageLoader />
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <FolderDot className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">No projects found</h3>
                <p className="mt-1 text-sm text-gray-500">We couldn't find any projects matching your criteria.</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="mt-4 text-sm font-medium text-green-600 hover:text-green-700">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => {
                  const diffClass = DIFFICULTY_STYLES[project.difficulty?.toLowerCase() || ''] || 'bg-gray-50 text-gray-700 ring-gray-500/20';
                  
                  return (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row gap-5">
                        
                        {/* Project Logo/Icon Area */}
                        <div className="hidden sm:flex flex-shrink-0 w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 items-center justify-center overflow-hidden">
                          {project.image ? (
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <Code2 className="w-6 h-6 text-gray-400" />
                          )}
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {project.featured && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                    Featured
                                  </span>
                                )}
                                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                                  {project.title}
                                </h3>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                                {project.creator?.name && (
                                  <div className="flex items-center gap-1.5">
                                    {project.creator.avatar ? (
                                      <img src={project.creator.avatar} alt="" className="w-4 h-4 rounded-full" />
                                    ) : (
                                      <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600">
                                        {project.creator.name.charAt(0)}
                                      </div>
                                    )}
                                    <span>{project.creator.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <Link
                              href={`/project-details/${project.id}`}
                              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                            >
                              View Details
                            </Link>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                            {project.description}
                          </p>

                          {/* Metadata Bottom Row */}
                          <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4">
                            {project.difficulty && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${diffClass}`}>
                                {project.difficulty}
                              </span>
                            )}
                            
                            {project.roleNeeded && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                <span>{project.roleNeeded}</span>
                              </div>
                            )}

                            {/* Tech Stack */}
                            {project.techStack && project.techStack.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 ml-auto">
                                {project.techStack.slice(0, 4).map(tech => (
                                  <span key={tech} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                    {tech}
                                  </span>
                                ))}
                                {project.techStack.length > 4 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                                    +{project.techStack.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && projects.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}