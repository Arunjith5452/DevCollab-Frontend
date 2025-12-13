import { CheckCircle2, Eye } from 'lucide-react';

import { TaskListItem } from "../../../projects/types/project.types";

interface InProgressTabProps {
    tasks: TaskListItem[];
    getAssigneeName: (id: string | null | undefined) => string;
    onMarkAsDone: (taskId: string) => void;
    onViewDetails: (task: TaskListItem) => void;
}

export default function InProgressTab({ tasks, getAssigneeName, onMarkAsDone, onViewDetails }: InProgressTabProps) {
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
                tasks.map((task, index) => (
                    <div
                        key={index}
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
                                        Mark as Done
                                    </button>
                                </div>
                            </div>

                            <p className="text-[#6b7280] text-sm mb-3">{task.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {task.tags.map((tag, index) => (
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
                    </div>
                ))
            ) : (
                <div className="text-center py-12">
                    <p className="text-[#6b7280]">No tasks in progress</p>
                </div>
            )}
        </div>
    );
}