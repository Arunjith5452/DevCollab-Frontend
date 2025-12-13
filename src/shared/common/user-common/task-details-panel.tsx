'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, User, FileText, ExternalLink, Check, MessageSquare, Send, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { ProjectTask, TaskComment } from "@/modules/tasks/types/task.types";
import { addComment } from "@/modules/tasks/services/task.api";

interface Assignee {
    userId: string;
    name: string;
}

interface TaskDetailsPanelProps {
    task: ProjectTask | null;
    isOpen: boolean;
    onClose: () => void;
    assignees: Assignee[];
    getAssigneeName: (id: string | null | undefined) => string;
    isCreator?: boolean;
    currentUserId?: string;
    onReassign?: (taskId: string, newAssigneeId: string) => Promise<void>;
    onStartTask?: (taskId: string) => Promise<void>;
    onMarkAsDone?: (taskId: string) => Promise<void>;
    onUpdateAcceptanceCriteria?: (taskId: string, criteria: { text: string; completed: boolean }[]) => Promise<void>;
    onTaskUpdated?: () => void;
}

const STATUS_CONFIG = {
    'todo': { label: 'To Do', color: 'text-gray-600', bg: 'bg-gray-100', icon: Circle },
    'in-progress': { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
    'done': { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
};

export default function TaskDetailsPanel({
    task,
    isOpen,
    onClose,
    assignees,
    getAssigneeName,
    isCreator = false,
    currentUserId,
    onReassign,
    onStartTask,
    onMarkAsDone,
    onUpdateAcceptanceCriteria,
    onTaskUpdated,
}: TaskDetailsPanelProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview');
    const [acceptanceCriteria, setAcceptanceCriteria] = useState<{ text: string; completed: boolean }[]>([]);
    const [isSavingCriteria, setIsSavingCriteria] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState<TaskComment[]>([]);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        if (task) {
            setAcceptanceCriteria(task.acceptanceCriteria || []);
            setComments((task.comments as TaskComment[]) || []);
        }
    }, [task?.id, task?.acceptanceCriteria, task?.comments]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleToggleCriteria = async (index: number) => {
        const updated = [...acceptanceCriteria];
        updated[index].completed = !updated[index].completed;
        setAcceptanceCriteria(updated);
        setIsSavingCriteria(true);
        try {
            await onUpdateAcceptanceCriteria?.(task!.id, updated);
            toast.success('Updated');
            onTaskUpdated?.();
        } catch {
            toast.error('Failed');
            updated[index].completed = !updated[index].completed;
            setAcceptanceCriteria(updated);
        } finally {
            setIsSavingCriteria(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !task) return;
        setIsSubmittingComment(true);
        try {
            await addComment(task.id, newComment.trim());
            setNewComment('');
            toast.success('Comment added');
            onTaskUpdated?.();
        } catch {
            toast.error('Failed');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (!task || !isOpen) return null;

    const statusConfig = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG['todo'];
    const StatusIcon = statusConfig.icon;
    const completedCount = acceptanceCriteria.filter(c => c.completed).length;
    const totalCount = acceptanceCriteria.length;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`fixed right-0 top-0 h-full w-full md:w-[720px] bg-white z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex-shrink-0 border-b border-gray-200">
                    <div className="px-8 py-6">
                        {/* Status & Close */}
                        <div className="flex items-center justify-between mb-6">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg}`}>
                                <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                                <span className={`text-sm font-medium ${statusConfig.color}`}>
                                    {statusConfig.label}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            {task.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{getAssigneeName(task.assignedId)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{task.deadline ? format(new Date(task.deadline), 'MMM d, yyyy') : 'No deadline'}</span>
                            </div>
                        </div>

                        {/* Payment Breakdown */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <DollarSign className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs font-medium text-blue-600">Total Payment</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900">${task.payment || 0}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <Check className="w-4 h-4 text-amber-600" />
                                    <span className="text-xs font-medium text-amber-600">Advance Paid</span>
                                </div>
                                <p className="text-2xl font-bold text-amber-900">${task.advancePaid || 0}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                                    <span className="text-xs font-medium text-emerald-600">Balance Due</span>
                                </div>
                                <p className="text-2xl font-bold text-emerald-900">
                                    ${((task.payment || 0) - (task.advancePaid || 0)).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {task.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        {!isCreator && (
                            <div className="mt-6 flex gap-3">
                                {task.status === 'todo' && onStartTask && (
                                    <button
                                        onClick={() => onStartTask(task.id)}
                                        className="flex-1 px-5 py-3 bg-gradient-to-r from-[#006b5b] to-[#008c75] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                                    >
                                        Start Working
                                    </button>
                                )}
                                {task.status === 'in-progress' && onMarkAsDone && (
                                    <button
                                        onClick={() => onMarkAsDone(task.id)}
                                        className="flex-1 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                                    >
                                        Submit for Review
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="px-8 flex gap-6 border-t border-gray-100">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === 'overview'
                                ? 'border-[#006b5b] text-[#006b5b]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === 'activity'
                                ? 'border-[#006b5b] text-[#006b5b]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Activity
                            {comments.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                                    {comments.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'overview' ? (
                        <div className="px-8 py-6 space-y-8">
                            {/* Description */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                    Description
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {task.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Acceptance Criteria */}
                            {acceptanceCriteria && acceptanceCriteria.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Acceptance Criteria
                                        </h3>
                                        <span className="text-xs font-medium text-gray-500">
                                            {completedCount} of {totalCount} completed
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {acceptanceCriteria.map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleToggleCriteria(i)}
                                                disabled={isSavingCriteria}
                                                className="w-full group"
                                            >
                                                <div className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${item.completed
                                                    ? 'border-emerald-200 bg-emerald-50/50'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}>
                                                    <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${item.completed
                                                        ? 'bg-emerald-500 border-emerald-500'
                                                        : 'border-gray-300 group-hover:border-emerald-400'
                                                        }`}>
                                                        {item.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                                    </div>
                                                    <span className={`flex-1 text-left text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'
                                                        }`}>
                                                        {item.text}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Documents */}
                            {task.documents && task.documents.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                        Attached Files
                                    </h3>
                                    <div className="space-y-2">
                                        {task.documents.map((doc, i) => {
                                            const isUrl = isValidUrl(doc);
                                            const fileName = doc.split('/').pop() || doc;
                                            return (
                                                <a
                                                    key={i}
                                                    href={isUrl ? doc : '#'}
                                                    target={isUrl ? '_blank' : undefined}
                                                    rel={isUrl ? 'noopener noreferrer' : undefined}
                                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white transition-all group ${!isUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <FileText className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                                    <span className="flex-1 text-sm text-gray-700 truncate">{fileName}</span>
                                                    {isUrl && <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="px-8 py-6">
                            {/* Comments */}
                            <div className="space-y-4">
                                {comments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500">No comments yet</p>
                                        <p className="text-xs text-gray-400 mt-1">Start a discussion about this task</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {comments.map((comment, i) => {
                                            const commenterName = getAssigneeName(comment.userId);
                                            const isOwnComment = currentUserId === comment.userId;
                                            const initial = commenterName.charAt(0).toUpperCase();

                                            return (
                                                <div key={i} className="flex gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isOwnComment ? 'bg-[#006b5b] text-white' : 'bg-gray-300 text-gray-700'
                                                        }`}>
                                                        {initial}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-baseline gap-2 mb-1">
                                                            <span className="font-semibold text-sm text-gray-900">
                                                                {commenterName}
                                                            </span>
                                                            {isOwnComment && (
                                                                <span className="text-xs text-[#006b5b] font-medium">You</span>
                                                            )}
                                                            <span className="text-xs text-gray-400">
                                                                {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                            {comment.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Comment Input - Sticky Bottom */}
                <div className="flex-shrink-0 border-t border-gray-200 bg-white px-8 py-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleCommentSubmit()}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#006b5b] transition-colors text-sm"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            disabled={!newComment.trim() || isSubmittingComment}
                            className="px-5 py-3 bg-[#006b5b] text-white rounded-xl hover:bg-[#005a4d] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

const isValidUrl = (str: string) => {
    try { new URL(str); return true; } catch { return false; }
};
