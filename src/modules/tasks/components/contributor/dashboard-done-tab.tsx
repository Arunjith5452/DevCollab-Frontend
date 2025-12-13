import { useState } from 'react';
import { CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

import { TaskListItem } from "../../../projects/types/project.types";

interface DoneTabProps {
  tasks: TaskListItem[];
  getAssigneeName: (id: string | null | undefined) => string;
  onViewDetails: (task: TaskListItem) => void;
}

export default function DoneTab({ tasks, getAssigneeName, onViewDetails }: DoneTabProps) {
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-[#cdeae5] rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Task Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#0c1d1a]">{task.title}</h3>
                <button
                  onClick={() => onViewDetails(task)}
                  className="px-3 py-1.5 text-sm border border-[#cdeae5] rounded-lg text-[#006b5b] hover:bg-[#e6f4f2] transition-colors"
                >
                  View Details
                </button>
              </div>
              <p className="text-[#6b7280] text-sm mb-3">{task.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#e6f4f2] text-[#006b5b] rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Task Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-[#cdeae5] mb-4">
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Deadline</p>
                <p className="text-sm font-medium text-[#0c1d1a]">{formatDate(task.deadline)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Status</p>
                <p className="text-sm font-medium text-green-600">Completed</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280] mb-1">Review Status</p>
                <p className="text-sm font-medium text-[#0c1d1a]">
                  {task.approval === 'approved' ? 'Approved' : task.approval === 'improvement-needed' ? 'Changes Requested' : 'Under Review'}
                </p>
              </div>
            </div>

            {/* Approval Status */}
            {task.approval && (
              <div className="pt-4 border-t border-[#cdeae5]">
                {task.approval === 'approved' ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">Approved</p>
                      <p className="text-xs text-green-600">Your work has been approved by the creator</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-orange-700">Needs Improvement</p>
                        <p className="text-xs text-orange-600">Creator has provided feedback</p>
                      </div>
                    </div>

                    {task.feedback && (
                      <button
                        onClick={() => setExpandedFeedback(expandedFeedback === task.id ? null : task.id)}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-[#f8fcfb] text-[#006b5b] rounded-lg hover:bg-[#e6f4f2] transition-colors text-sm font-medium"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expandedFeedback === task.id ? 'rotate-180' : ''}`}
                        />
                        View Creator Feedback
                      </button>
                    )}

                    {expandedFeedback === task.id && task.feedback && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-2">
                        <p className="text-sm font-semibold text-[#0c1d1a]">Creator's Feedback:</p>
                        <p className="text-sm text-[#6b7280]">{task.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-[#6b7280]">No completed tasks yet</p>
        </div>
      )}
    </div>
  );
}