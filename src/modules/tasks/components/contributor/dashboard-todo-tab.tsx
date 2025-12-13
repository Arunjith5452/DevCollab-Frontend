'use client';

import { Eye, EyeOff, Play } from 'lucide-react';

import { TaskListItem } from "../../../projects/types/project.types";

interface TodoTabProps {
  tasks: TaskListItem[];
  getAssigneeName: (id: string | null | undefined) => string;
  onViewDetails: (task: TaskListItem) => void;
  currentUserId: string;
}

export default function TodoTab({ tasks, getAssigneeName, onViewDetails, currentUserId }: TodoTabProps) {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const isMyTask = (assignedId: string) => assignedId === currentUserId;

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-[#6b7280] py-12">No tasks available</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="bg-white border border-[#cdeae5] rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-[#0c1d1a] mb-2">{task.title}</h3>
            <p className="text-[#6b7280] text-sm mb-4">{task.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {task.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-[#e6f4f2] text-[#006b5b] rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t border-[#cdeae5] pt-4">
              <div><span className="text-[#6b7280]">Assigned:</span> <strong>{getAssigneeName(task.assignedId)}</strong></div>
              <div><span className="text-[#6b7280]">Deadline:</span> <strong>{formatDate(task.deadline)}</strong></div>
              <div><span className="text-[#6b7280]">Status:</span> <strong className="text-orange-600">To Do</strong></div>
            </div>

            <div className="mt-5 flex justify-end">
              {isMyTask(task.assignedId) ? (
                <button
                  onClick={() => onViewDetails(task)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#006b5b] text-white rounded-lg font-semibold hover:bg-[#005a4d] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              ) : (
                <div className="text-sm text-[#6b7280] italic">Assigned to {getAssigneeName(task.assignedId)}</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}