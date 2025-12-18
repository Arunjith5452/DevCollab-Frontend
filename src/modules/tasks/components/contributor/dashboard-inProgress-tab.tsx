import { useState } from 'react';
import { CheckCircle2, Eye, AlertCircle, ChevronDown } from 'lucide-react';

import { TaskListItem } from "../../../projects/types/project.types";

interface InProgressTabProps {
    tasks: TaskListItem[];
    getAssigneeName: (id: string | null | undefined) => string;
    onMarkAsDone: (taskId: string) => void;
    onViewDetails: (task: TaskListItem) => void;
}

export default function InProgressTab({
    tasks,
    getAssigneeName,
    onMarkAsDone,
    onViewDetails
}: InProgressTabProps) {
    const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (deadline: string) => {
        return new Date(deadline) < new Date();
    };

    return (
        <div className="space-y-4">
            {tasks.length > 0 ? (
                tasks.map((task) => {
                    const needsImprovement = task.approval === 'improvement-needed';
                    const hasFeedback = !!task.feedback;

                    return (
                        <div
                            key={task.id}
                            className="bg-white border border-[#cdeae5] rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                            {/* Task Header */}
                            <div className="mb-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-[#0c1d1a] flex-1">{task.title}</h3>
                                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                        <button
                                            onClick={() => onViewDetails(task)}
                                            className="flex items-center gap-2 px-3 py-2 text-[#006b5b] bg-[#e6f4f2] rounded-lg text-sm font-semibold hover:bg-[#d0e8e4] transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Details
                                        </button>
                                        <button
                                            onClick={() => onMarkAsDone(task.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#006b5b] text-white rounded-lg text-sm font-semibold hover:bg-[#005a4d] transition-colors"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            {needsImprovement ? 'Resubmit for Review' : 'Mark as Done'}
                                        </button>
                                    </div>
                                </div>

                                <p className="text-[#6b7280] text-sm mb-3">{task.description}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {task.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-[#e6f4f2] text-[#006b5b] rounded-full text-xs font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Task Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-[#cdeae5]">
                                <div>
                                    <p className="text-xs text-[#6b7280] mb-1">Deadline</p>
                                    <p className={`text-sm font-medium ${isOverdue(task.deadline) ? 'text-red-600' : 'text-[#0c1d1a]'}`}>
                                        {formatDate(task.deadline)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#6b7280] mb-1">Status</p>
                                    <p className="text-sm font-medium text-blue-600">In Progress</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#6b7280] mb-1">Progress</p>
                                    <p className="text-sm font-medium text-[#0c1d1a]">In Development</p>
                                </div>
                            </div>

                            {/* Improvement Feedback Section - Only show if needs improvement */}
                            {needsImprovement && (
                                <div className="mt-4 pt-4 border-t border-[#cdeae5]">
                                    <div className="space-y-3">
                                        {/* Banner */}
                                        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                                            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold text-orange-700">Needs Improvement</p>
                                                <p className="text-xs text-orange-600">Creator has requested changes</p>
                                            </div>
                                        </div>

                                        {/* View Feedback Button */}
                                        {hasFeedback && (
                                            <button
                                                onClick={() => setExpandedFeedback(expandedFeedback === task.id ? null : task.id)}
                                                className="w-full flex items-center justify-between px-4 py-3 bg-[#f8fcfb] text-[#006b5b] rounded-lg hover:bg-[#e6f4f2] transition-colors text-sm font-medium"
                                            >
                                                <span>View Creator Feedback</span>
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform ${expandedFeedback === task.id ? 'rotate-180' : ''}`}
                                                />
                                            </button>
                                        )}

                                        {/* Expanded Feedback */}
                                        {expandedFeedback === task.id && hasFeedback && (
                                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                                <p className="text-sm font-semibold text-[#0c1d1a] mb-2">Creator's Feedback:</p>
                                                <p className="text-sm text-[#6b7280] whitespace-pre-wrap">{task.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-12">
                    <p className="text-[#6b7280]">No tasks in progress</p>
                </div>
            )}
        </div>
    );
}