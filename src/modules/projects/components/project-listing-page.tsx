"use client";
import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, X, Filter, Code2, BarChart3, Users } from 'lucide-react';
import { Header } from '@/shared/common/user-common/Header';
import { Pagination } from '@/shared/common/admin-common';
import { listProject } from '../services/project.api';
import { SearchInput } from '@/shared/common/admin-common/Searching';
import { CustomSelectProps, ListProjectResponse, Project } from '../types/project.types';
import api from '@/lib/axios';
import Link from 'next/link';
import PageLoader from '@/shared/common/LoadingComponent';

export default function ExploreProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [selectedTech, setSelectedTech] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [showTechInput, setShowTechInput] = useState(false);
  const [customTech, setCustomTech] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [customRole, setCustomRole] = useState("");
  const roleInputRef = useRef<HTMLInputElement>(null);
  const techInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/api/profile/me', { withCredentials: true });
      } catch (error: any) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [])


  const featuredProjects: Project[] = [
    {
      _id: '1',
      title: 'AI-Powered Chatbot for Customer Support',
      description: 'Develop an intelligent chatbot using natural language processing to handle customer inquiries and provide instant support.',
      featured: true,
      image: '🤖',
      techStack: ['Python', 'NLP', 'AI'],
      difficulty: 'Advanced',
      roleNeeded: 'UI && UX Designer'
    }
  ];

  useEffect(() => {
    if (showTechInput && techInputRef.current) techInputRef.current.focus();
  }, [showTechInput]);

  useEffect(() => {
    if (showRoleInput && roleInputRef.current) roleInputRef.current.focus();
  }, [showRoleInput]);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const data: ListProjectResponse = await listProject({
          search: searchTerm,
          techStack: selectedTech || undefined,
          difficulty: selectedDifficulty || undefined,
          roleNeeded: selectedRole || undefined,
          page: currentPage
        });
        setProjects(data.projects ?? []);
        setTotalPages(data.total ?? 1);
      } catch (error) {
        setProjects([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [searchTerm, selectedTech, selectedDifficulty, selectedRole, currentPage]);



  const activeFiltersCount = [selectedTech, selectedDifficulty, selectedRole].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedTech("");
    setSelectedDifficulty("");
    setCustomRole("");
    setShowTechInput(false);
    setShowRoleInput(false);
    setCustomTech("");
    setSelectedRole("");
  };

  const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onChange,
    placeholder,
    options,
    allowCustom = false,
    showCustomInput = false,
    onShowCustomInput = () => { }
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayValue = value || placeholder;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageLoader />
      </div>
    );


    return (
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>{displayValue}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (opt.value === 'other' && allowCustom) {
                    onShowCustomInput(true);
                    onChange("");
                  } else {
                    onChange(opt.value === '__any__' ? '' : opt.value);
                    if (allowCustom) onShowCustomInput(false);
                  }
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${opt.value === value ? 'bg-teal-50 text-teal-700' : 'text-gray-900'
                  } ${opt.value === 'other' ? 'text-teal-600 font-medium border-t border-gray-200' : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16 pb-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Explore Projects
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Find projects that match your skills and interests. Collaborate with other developers.
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <SearchInput
              value={searchTerm}
              onChange={(v) => setSearchTerm(v)}
              placeholder="Search projects by title"
              debounceTime={500} // optional
            />
          </div>


          {/* Filters Section */}
          <div className="mb-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 bg-teal-600 text-white text-xs font-semibold rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filter Grid */}
            <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Filter Projects</h3>
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear all
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Tech Stack Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Code2 className="w-4 h-4" />
                      Technology
                    </label>
                    <CustomSelect
                      value={showTechInput ? "Custom" : selectedTech}
                      onChange={setSelectedTech}
                      placeholder="Any Technology"
                      showCustomInput={showTechInput}
                      onShowCustomInput={setShowTechInput}
                      options={[
                        { value: '__any__', label: 'Any Technology' },
                        { value: 'React', label: 'React' },
                        { value: 'Node.js', label: 'Node.js' },
                        { value: 'Python', label: 'Python' },
                        { value: 'TypeScript', label: 'TypeScript' },
                        { value: 'Next.js', label: 'Next.js' },
                        { value: 'Vue', label: 'Vue' },
                        { value: 'Flutter', label: 'Flutter' },
                        { value: 'Django', label: 'Django' },
                        { value: 'other', label: '+ Add Custom' }
                      ]}
                      allowCustom
                    />
                    {showTechInput && (
                      <input
                        ref={techInputRef}
                        type="text"
                        placeholder="e.g. Svelte, Go, Rust..."
                        value={customTech}
                        onChange={(e) => {
                          setCustomTech(e.target.value);
                          setSelectedTech(e.target.value);
                        }}
                        className="w-full px-3 py-2 text-sm border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50"
                      />
                    )}
                  </div>

                  {/* Difficulty Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <BarChart3 className="w-4 h-4" />
                      Difficulty Level
                    </label>
                    <CustomSelect
                      value={selectedDifficulty}
                      onChange={setSelectedDifficulty}
                      placeholder="Any Level"
                      options={[
                        { value: '__any__', label: 'Any Level' },
                        { value: 'Beginner', label: 'Beginner' },
                        { value: 'Intermediate', label: 'Intermediate' },
                        { value: 'Advanced', label: 'Advanced' }
                      ]}
                    />
                  </div>

                  {/* Role Needed Filter */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Users className="w-4 h-4" /> Role Needed
                    </label>
                    <CustomSelect
                      value={selectedRole}
                      onChange={setSelectedRole}
                      placeholder="Any Role"
                      options={[
                        { value: '__any__', label: 'Any Role' },
                        { value: 'Frontend Developer', label: 'Frontend Developer' },
                        { value: 'Backend Developer', label: 'Backend Developer' },
                        { value: 'Full Stack Developer', label: 'Full Stack Developer' },
                        { value: 'UI/UX Designer', label: 'UI/UX Designer' },
                        { value: 'DevOps Engineer', label: 'DevOps Engineer' },
                        { value: 'Data Scientist', label: 'Data Scientist' },
                        { value: 'other', label: '+ Add Custom Role' }
                      ]}
                      allowCustom
                      showCustomInput={showRoleInput}
                      onShowCustomInput={setShowRoleInput}
                    />
                    {showRoleInput && (
                      <input
                        ref={roleInputRef}
                        type="text"
                        placeholder="e.g. Mobile Developer"
                        value={customRole}
                        onChange={(e) => {
                          setCustomRole(e.target.value);
                          setSelectedRole(e.target.value);
                        }}
                        className="w-full px-3 py-2 text-sm border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50"
                      />
                    )}
                  </div>
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {selectedTech && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded-full border border-teal-200">
                          {selectedTech}
                          <button
                            type="button"
                            onClick={() => { setSelectedTech(""); setShowTechInput(false); }}
                            className="hover:bg-teal-100 rounded-full p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                      {selectedDifficulty && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-200">
                          {selectedDifficulty}
                          <button
                            type="button"
                            onClick={() => setSelectedDifficulty("")}
                            className="hover:bg-purple-100 rounded-full p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                      {selectedRole && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                          {selectedRole}
                          <button
                            type="button"
                            onClick={() => { setSelectedRole(""); setShowRoleInput(false); }}
                            className="hover:bg-blue-100 rounded-full p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Projects */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">Featured Projects</h2>
            {featuredProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center">
                  <div className="md:col-span-2 space-y-3 order-2 md:order-1">
                    <div className="inline-block px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
                      Featured
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {project.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
                      {project.description}
                    </p>
                    <button type="button" className="mt-3 px-5 py-2 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg hover:bg-teal-100 transition-colors">
                      View Project
                    </button>
                  </div>
                  <div className="flex justify-center items-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 h-32 sm:h-40 order-1 md:order-2">
                    <div className="text-6xl sm:text-8xl">{project.image}</div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* All Projects */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">All Projects</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
              </div>
            ) : projects.length === 0 ? (
              <p className="text-center text-gray-500 py-12 text-sm sm:text-base">No projects found.</p>
            ) : (
              <div className="space-y-5">
                {projects.map((project, index) => (
                  <div key={project._id || index} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center">
                      <div className="md:col-span-2 space-y-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {project.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                          {project.description}
                        </p>
                        <Link
                          href={`/project-details/${project._id}`}
                          className="inline-block mt-3 px-5 py-2 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg hover:bg-teal-100 transition-colors"
                        >
                          View Projecti 
                        </Link>

                      </div>
                      <div className="flex justify-center items-center bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 h-32 sm:h-40">
                        <div className="text-6xl sm:text-8xl">{project.image}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Pagination */}
          {!loading && projects.length > 0 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}