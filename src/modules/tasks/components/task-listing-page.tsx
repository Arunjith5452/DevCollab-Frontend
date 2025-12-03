'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search, Filter, ChevronRight, MapPin } from 'lucide-react';
import { CreatorSidebar } from '@/shared/common/user-common/Creator-sidebar';
import CreatorHeader from '@/shared/common/user-common/Creator-header';

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'done' | 'improvement-needed';
  deadline: string;
  payment: number;
  advancePaid: number;
  tags: string[];
  description: string;
  acceptanceCriteria: Array<{ text: string; completed: boolean }>;
}

export default function TasksListingPage() {

  const router = useRouter();

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design Dashboard UI',
      assignedTo: 'Sarah Smith',
      status: 'in-progress',
      deadline: '2024-07-15',
      payment: 500,
      advancePaid: 250,
      tags: ['Frontend', 'Design', 'UIUX'],
      description: 'Create a responsive dashboard UI',
      acceptanceCriteria: [
        { text: 'Mobile responsive design', completed: true },
        { text: 'Dark mode support', completed: false }
      ]
    },
    {
      id: '2',
      title: 'API Integration',
      assignedTo: 'Mike Johnson',
      status: 'todo',
      deadline: '2024-07-20',
      payment: 800,
      advancePaid: 0,
      tags: ['Backend', 'React'],
      description: 'Integrate backend APIs with frontend',
      acceptanceCriteria: [
        { text: 'All endpoints connected', completed: false },
        { text: 'Error handling implemented', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Bug Fixes',
      assignedTo: 'John Doe',
      status: 'done',
      deadline: '2024-07-10',
      payment: 300,
      advancePaid: 300,
      tags: ['Frontend', 'Testing'],
      description: 'Fix critical bugs in production',
      acceptanceCriteria: [
        { text: 'All bugs fixed', completed: true },
        { text: 'Tests passing', completed: true }
      ]
    },
    {
      id: '4',
      title: 'Documentation',
      assignedTo: 'Emily Brown',
      status: 'in-progress',
      deadline: '2024-07-25',
      payment: 400,
      advancePaid: 200,
      tags: ['Documentation'],
      description: 'Write comprehensive documentation',
      acceptanceCriteria: [
        { text: 'API docs completed', completed: true },
        { text: 'User guide written', completed: false }
      ]
    },
    {
      id: '5',
      title: 'Performance Optimization',
      assignedTo: 'David Lee',
      status: 'todo',
      deadline: '2024-07-30',
      payment: 600,
      advancePaid: 150,
      tags: ['Backend', 'React'],
      description: 'Optimize application performance',
      acceptanceCriteria: [
        { text: 'Load time < 2s', completed: false },
        { text: 'Memory usage optimized', completed: false }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [reassignMember, setReassignMember] = useState<string>('');
  const [showReassignDropdown, setShowReassignDropdown] = useState(false);

  const teamMembers = ['John Doe', 'Sarah Smith', 'Mike Johnson', 'Emily Brown', 'David Lee'];

  // Get unique assignees from tasks
  const assignees = Array.from(new Set(tasks.map(task => task.assignedTo)));

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assignedTo === assigneeFilter;
      return matchesSearch && matchesStatus && matchesAssignee;
    });
  }, [searchTerm, statusFilter, assigneeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'improvement-needed':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done',
      'improvement-needed': 'Improvement Needed'
    };
    return labels[status] || status;
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
    setReassignMember(task.assignedTo);
  };

  const handleReassignTask = () => {
    if (selectedTask && reassignMember) {
      setSelectedTask({ ...selectedTask, assignedTo: reassignMember });
      // TODO: Call API to update task assignment
      console.log('Task reassigned to:', reassignMember);
      setShowReassignDropdown(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <CreatorSidebar activeItem="tasks" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <CreatorHeader projectName={''} />

        {/* Page Content */}
        <main className="flex-1 px-8 py-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0c1d1a] mb-2">Tasks</h1>
              <p className="text-[#6b7280]">Manage and track all project tasks</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type="text"
                  placeholder="Search tasks or assignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center gap-2 px-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] hover:bg-[#f8fcfb] transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span className="text-sm font-medium">Status</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showStatusDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 border border-[#cdeae5] rounded-lg bg-white shadow-lg z-10">
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] transition-colors text-sm ${
                        statusFilter === 'all' ? 'bg-[#e6f4f2] text-[#006b5b] font-medium' : 'text-[#0c1d1a]'
                      }`}
                    >
                      All Status
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('todo');
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] transition-colors text-sm ${
                        statusFilter === 'todo' ? 'bg-[#e6f4f2] text-[#006b5b] font-medium' : 'text-[#0c1d1a]'
                      }`}
                    >
                      To Do
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('in-progress');
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] transition-colors text-sm ${
                        statusFilter === 'in-progress' ? 'bg-[#e6f4f2] text-[#006b5b] font-medium' : 'text-[#0c1d1a]'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('done');
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] transition-colors text-sm ${
                        statusFilter === 'done' ? 'bg-[#e6f4f2] text-[#006b5b] font-medium' : 'text-[#0c1d1a]'
                      }`}
                    >
                      Done
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter('improvement-needed');
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] transition-colors text-sm ${
                        statusFilter === 'improvement-needed' ? 'bg-[#e6f4f2] text-[#006b5b] font-medium' : 'text-[#0c1d1a]'
                      }`}
                    >
                      Improvement Needed
                    </button>
                  </div>
                )}
              </div>

              {/* Assignee Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  className="flex items-center gap-2 px-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] hover:bg-[#f8fcfb] transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span className="text-sm font-medium">Assignee</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showAssigneeDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 border border-[#cdeae5] rounded-lg bg-white shadow-lg z-10">
                    <button
                      onClick={() => {
                        setAssigneeFilter('all');
                        setShowAssigneeDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] transition-colors text-sm ${
                        assigneeFilter === 'all' ? 'bg-[#e6f4f2] text-[#006b5b] font-medium' : 'text-[#0c1d1a]'
                      }`}
                    >
                      All Assignees
                    </button>
                    {assignees.map((assignee) => (
                      <button
                        key={assignee}
                        onClick={() => {
                          setAssigneeFilter(assignee);
                          setShowAssigneeDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] transition-colors text-sm ${
                          assigneeFilter === assignee ? 'bg-[#e6f4f2] text-[#006b5b] font-medium' : 'text-[#0c1d1a]'
                        }`}
                      >
                        {assignee}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="p-6 border border-[#cdeae5] rounded-lg hover:shadow-lg hover:border-[#006b5b] transition-all cursor-pointer bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#0c1d1a] mb-2">{task.title}</h3>
                        <p className="text-[#6b7280] text-sm mb-3">{task.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {task.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-[#e6f4f2] text-[#006b5b] rounded-full text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-[#cdeae5] flex-shrink-0" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-[#6b7280] mb-1">Assigned To</p>
                        <p className="text-sm font-medium text-[#0c1d1a]">{task.assignedTo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] mb-1">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] mb-1">Deadline</p>
                        <p className="text-sm font-medium text-[#0c1d1a]">{formatDate(task.deadline)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280] mb-1">Payment</p>
                        <p className="text-sm font-medium text-[#0c1d1a]">${task.payment} <span className="text-xs text-[#6b7280]">(${task.advancePaid} paid)</span></p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-[#cdeae5] mx-auto mb-3" />
                  <p className="text-[#6b7280] mb-1">No tasks found</p>
                  <p className="text-sm text-[#6b7280]">Try adjusting your filters or search term</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[#cdeae5] bg-white">
              <h2 className="text-2xl font-bold text-[#0c1d1a]">Task Details</h2>
              <button
                onClick={() => setShowTaskDetails(false)}
                className="text-[#6b7280] hover:text-[#0c1d1a] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-[#0c1d1a] mb-2">{selectedTask.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-[#e6f4f2] text-[#006b5b] rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Task Information Grid */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-[#f8fcfb] rounded-lg border border-[#cdeae5]">
                <div>
                  <p className="text-xs text-[#6b7280] mb-1">Payment</p>
                  <p className="text-lg font-semibold text-[#0c1d1a]">${selectedTask.payment}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6b7280] mb-1">Advance Paid</p>
                  <p className="text-lg font-semibold text-[#0c1d1a]">${selectedTask.advancePaid}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6b7280] mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                    {getStatusLabel(selectedTask.status)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#6b7280] mb-1">Deadline</p>
                  <p className="text-sm font-medium text-[#0c1d1a]">{formatDate(selectedTask.deadline)}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-[#0c1d1a] mb-2">Description</h4>
                <p className="text-[#6b7280] text-sm">{selectedTask.description}</p>
              </div>

              {/* Acceptance Criteria */}
              <div>
                <h4 className="font-semibold text-[#0c1d1a] mb-3">Acceptance Criteria</h4>
                <div className="space-y-2">
                  {selectedTask.acceptanceCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[#f8fcfb] rounded border border-[#cdeae5]">
                      <input
                        type="checkbox"
                        checked={criteria.completed}
                        disabled
                        className="w-4 h-4 mt-1 flex-shrink-0"
                      />
                      <p className={`text-sm ${criteria.completed ? 'text-[#6b7280] line-through' : 'text-[#0c1d1a]'}`}>
                        {criteria.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reassign Section */}
              <div className="border-t border-[#cdeae5] pt-6">
                <h4 className="font-semibold text-[#0c1d1a] mb-3">Assigned To</h4>
                <div className="relative mb-4">
                  <button
                    onClick={() => setShowReassignDropdown(!showReassignDropdown)}
                    className="w-full px-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] hover:bg-[#f8fcfb] transition-colors text-left bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{reassignMember}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showReassignDropdown ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {showReassignDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 border border-[#cdeae5] rounded-lg bg-white shadow-lg z-20">
                      {teamMembers.map((member) => (
                        <button
                          key={member}
                          type="button"
                          onClick={() => setReassignMember(member)}
                          className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] transition-colors text-sm ${
                            reassignMember === member ? 'bg-[#e6f4f2] text-[#006b5b] font-medium' : 'text-[#0c1d1a]'
                          }`}
                        >
                          {member}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {reassignMember !== selectedTask.assignedTo && (
                  <button
                    onClick={handleReassignTask}
                    className="w-full px-4 py-3 bg-[#006b5b] text-white rounded-lg font-semibold hover:bg-[#005a4d] transition-colors"
                  >
                    Update Assignment
                  </button>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex gap-4 p-6 border-t border-[#cdeae5] bg-white">
              <button
                onClick={() => setShowTaskDetails(false)}
                className="flex-1 px-6 py-3 border border-[#cdeae5] text-[#0c1d1a] rounded-lg font-semibold hover:bg-[#f8fcfb] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}