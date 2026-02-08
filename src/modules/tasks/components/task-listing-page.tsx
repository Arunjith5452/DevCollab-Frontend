'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronRight, MapPin, ChevronDown, FileText, X, Download, ExternalLink } from 'lucide-react';
import { CreatorSidebar } from '@/shared/common/user-common/Creator-sidebar';
import CreatorHeader from '@/shared/common/user-common/Creator-header';
import { SearchInput } from '@/shared/common/Searching';
import { Pagination } from '@/shared/common/Pagination';
import { format } from 'date-fns';
import { ProjectTask } from '@/modules/tasks/types/task.types';
import { getAssignees, assignTask } from '../services/task.api';
import { userProfile } from '@/modules/user/services/user.api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useUserStore';
import TaskDetailsPanel from '@/shared/common/user-common/task-details-panel';
import { getErrorMessage } from '@/shared/utils/ErrorMessage';

interface InitialData {
  tasks: ProjectTask[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

interface TasksListingProps {
  initialData: InitialData;
  initialFilters: {
    search: string;
    status: string;
    assignee: string;
  };
  projectId: string;
}

interface Assignee { userId: string; name: string }


export default function TasksListingPage({
  initialData,
  initialFilters,
  projectId
}: TasksListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await userProfile();
        console.log("check data", data)
      } catch (error) {
        getErrorMessage(error)
      }
    }
    fetchData()
  }, [])

  const [searchTerm, setSearchTerm] = useState(initialFilters.search);
  const [statusFilter, setStatusFilter] = useState(initialFilters.status);
  const [assigneeFilter, setAssigneeFilter] = useState(initialFilters.assignee);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);

  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [reassignMember, setReassignMember] = useState<string>('');
  const [showReassignDropdown, setShowReassignDropdown] = useState(false);

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [assignees, setAssignees] = useState<Assignee[]>([])

  const statusRef = useRef<HTMLDivElement>(null)
  const assigneeRef = useRef<HTMLDivElement>(null)
  const reassignRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setShowStatusDropdown(false);
      if (assigneeRef.current && !assigneeRef.current.contains(e.target as Node)) setShowAssigneeDropdown(false);
      if (reassignRef.current && !reassignRef.current.contains(e.target as Node)) setShowReassignDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [])


  useEffect(() => {
    if (selectedTask) {
      const updatedTask = initialData.tasks.find(t => t.id === selectedTask.id);
      if (updatedTask && JSON.stringify(updatedTask) !== JSON.stringify(selectedTask)) {
        setSelectedTask(updatedTask)
      }
    }
  }, [initialData, selectedTask])


  useEffect(() => {
    if (projectId) {
      getAssignees(projectId)
        .then(r => setAssignees(r.data || []))
        .catch(() => toast.error('Failed to load members'));
    }
  }, [projectId])


  useEffect(() => {
    const fetchTasks = async () => {
      const params = new URLSearchParams();
      if (projectId) params.set('projectId', projectId);
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (assigneeFilter !== 'all') params.set('assignee', assigneeFilter);
      params.set('page', currentPage.toString());

      router.replace(`/task-listing?${params.toString()}`, { scroll: false });
    };

    fetchTasks();
  }, [searchTerm, statusFilter, assigneeFilter, currentPage, projectId, router])




  const getAssigneeName = (assignedId: string | null | undefined) => {
    if (!assignedId) return 'Unassigned';
    const member = assignees.find(m => m.userId === assignedId);
    return member?.name || 'Unknown User';
  };

  const assigneeOptions = assignees.filter(member =>
    initialData.tasks.some(task => task.assignedId === member.userId)
  );

  const statusLabels: Record<string, string> = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
    'improvement-needed': 'Improvement Needed',
  };

  const getStatusLabel = (status: string) => statusLabels[status] || status;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'improvement-needed': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const safeFormatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '—';
      return format(date, 'MMM d, yyyy');
    } catch {
      return '—';
    }
  };

  const filteredTasks = initialData.tasks.filter(task => {
    const assigneeName = getAssigneeName(task.assignedId).toLowerCase();
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assigneeName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assignedId === assigneeFilter;
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const handleTaskClick = (task: ProjectTask) => {
    setSelectedTask(task);
    setReassignMember(task.assignedId);
    setShowTaskDetails(true);
  };

  const handleReassignTask = async (taskId: string, newAssigneeId: string) => {
    try {
      await assignTask(taskId, newAssigneeId);

      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, assignedId: newAssigneeId });
      }

      router.refresh();
      toast.success("Task reassigned successfully");
    } catch {
      toast.error("Failed to reassign task");
      throw new Error("Failed");
    }
  };


  return (
    <div className="flex min-h-screen bg-white">
      <CreatorSidebar activeItem="tasks" />
      <div className="flex-1 flex flex-col">
        <CreatorHeader />

        <main className="flex-1 px-8 py-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0c1d1a] mb-2">Tasks</h1>
              <p className="text-[#6b7280]">Manage and track all project tasks</p>
            </div>

            {/* Search + Filters */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1">
                <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search tasks or assignee..." debounceTime={400} />
              </div>

              <div className="relative" ref={statusRef}>
                <button onClick={() => setShowStatusDropdown(p => !p)} className="flex items-center gap-2 px-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] hover:bg-[#f8fcfb]">
                  <Filter className="w-5 h-5" />
                  <span className="text-sm font-medium">Status</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 border border-[#cdeae5] rounded-lg bg-white shadow-lg z-50">
                    {['all', 'todo', 'in-progress', 'done'].map(val => (
                      <button key={val} onClick={() => { setStatusFilter(val); setShowStatusDropdown(false); }}
                        className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] text-sm ${statusFilter === val ? 'bg-[#e6f4f2] text-[#006b5b] font-medium' : 'text-[#0c1d1a]'}`}>
                        {val === 'all' ? 'All Status' : getStatusLabel(val)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={assigneeRef}>
                <button onClick={() => setShowAssigneeDropdown(p => !p)} className="flex items-center gap-2 px-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] hover:bg-[#f8fcfb]">
                  <Filter className="w-5 h-5" />
                  <span className="text-sm font-medium">Assignee</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAssigneeDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showAssigneeDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 border border-[#cdeae5] rounded-lg bg-white shadow-lg z-50">
                    <button onClick={() => { setAssigneeFilter('all'); setShowAssigneeDropdown(false); }}
                      className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] text-sm ${assigneeFilter === 'all' ? 'bg-[#e6f4f2] text-[#006b5b]' : 'text-[#0c1d1a]'}`}>
                      All Assignees
                    </button>
                    {assigneeOptions.map(member => (
                      <button key={member.userId} onClick={() => { setAssigneeFilter(member.userId); setShowAssigneeDropdown(false); }}
                        className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] text-sm ${assigneeFilter === member.userId ? 'bg-[#e6f4f2] text-[#006b5b]' : 'text-[#0c1d1a]'}`}>
                        {member.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Task Cards */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-[#cdeae5] mx-auto mb-3" />
                  <p className="text-[#6b7280] mb-1">No tasks found</p>
                  <p className="text-sm text-[#6b7280]">Try adjusting your filters or search term</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div key={task.id} onClick={() => handleTaskClick(task)}
                    className="p-6 border border-[#cdeae5] rounded-lg hover:shadow-lg hover:border-[#006b5b] transition-all cursor-pointer bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#0c1d1a] mb-2">{task.title}</h3>
                        <p className="text-[#6b7280] text-sm mb-3">{task.description || 'No description'}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {task.tags?.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-[#e6f4f2] text-[#006b5b] rounded-full text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-[#cdeae5]" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><p className="text-xs text-[#6b7280]">Assigned To</p><p className="font-medium text-[#0c1d1a]">{getAssigneeName(task.assignedId)}</p></div>
                      <div><p className="text-xs text-[#6b7280]">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </div>
                      <div><p className="text-xs text-[#6b7280]">Deadline</p>
                        <p className="font-medium text-[#0c1d1a]">
                          {safeFormatDate(task.deadline)}
                        </p>
                      </div>
                      <div><p className="text-xs text-[#6b7280]">Payment</p>
                        <p className="font-medium text-[#0c1d1a]">${task.payment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {initialData.totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={initialData.totalPages} onPageChange={setCurrentPage} />
            )}
          </div>
        </main>
      </div>

      {showTaskDetails && selectedTask && (
        <TaskDetailsPanel
          task={selectedTask}
          isOpen={showTaskDetails}
          onClose={() => setShowTaskDetails(false)}
          assignees={assignees}
          getAssigneeName={getAssigneeName}
          isCreator={true}
          currentUserId={user?.userId}
          onReassign={handleReassignTask}
          onTaskUpdated={() => router.refresh()}
        />
      )}
    </div>
  );
}