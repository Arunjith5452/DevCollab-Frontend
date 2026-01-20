'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  DollarSign,
  User,
  FileText,
  ExternalLink,
  Check,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { ProjectTask, TaskComment } from "@/modules/tasks/types/task.types";
import { addComment } from "@/modules/tasks/services/task.api";
import api from '@/lib/axios';
import ConfirmModal from '../ConfirmModal';

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
  'done': { label: 'Submitted', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  'under-review': { label: 'Under Review', color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock },
  'approved': { label: 'Approved', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  // Helper variables
  const isUnderReview = task?.status === 'done' && task?.approval === 'under-review';
  console.log("isUnderReview", task?.approval)
  const isApproved = task?.status === 'done' && task?.approval === 'approved';
  const needsImprovement = task?.status === 'in-progress' && !!task?.feedback;

  const handleApprove = async (taskId: string) => {
    setIsSubmittingApproval(true);
    try {
      await api.patch(`/api/tasks/${taskId}/approve`);
      toast.success("Task approved and payment completed!");
      onTaskUpdated?.();
    } catch {
      toast.error("Failed to approve task");
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const handleRequestImprovement = async () => {
    if (!feedbackText.trim()) {
      toast.error("Feedback is required");
      return;
    }
    console.log("feedbackText:", feedbackText)
    setIsSubmittingApproval(true);
    try {
      await api.patch(`/api/tasks/${task!.id}/request-improvement`, {
        feedBack: feedbackText.trim(),
      });
      toast.success("Feedback sent — task moved back to In Progress");
      setShowFeedbackModal(false);
      setFeedbackText('');
      onTaskUpdated?.();
    } catch {
      toast.error("Failed to send feedback");
    } finally {
      setIsSubmittingApproval(false);
    }
  };

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
      toast.success('Criteria updated');
      onTaskUpdated?.();
    } catch {
      toast.error('Failed to update');
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
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (!task || !isOpen) return null;

  const statusKey = task.approval === 'approved' ? 'approved' :
    task.approval === 'under-review' ? 'under-review' :
      task.status;

  const statusConfig = STATUS_CONFIG[statusKey as keyof typeof STATUS_CONFIG]; const StatusIcon = statusConfig.icon;
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
                <span className={`text-sm font-medium ${statusConfig.color}`}>
                  {task.approval === 'approved'
                    ? (task.escrowStatus === 'released' ? 'Approved & Payment Released' : 'Approved')
                    : task.approval === 'under-review'
                      ? 'Under Review'
                      : task.status === 'done'
                        ? 'Submitted'
                        : statusConfig.label
                  }
                  {needsImprovement && ' (Needs Improvement)'}
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
                  <span className="text-xs font-medium text-amber-600">Released</span>
                </div>
                <p className="text-2xl font-bold text-amber-900">
                  ${(task.approval === 'approved' && task.escrowStatus === 'released') ? (task.payment || 0) : 0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600">Balance Due</span>
                </div>
                <p className="text-2xl font-bold text-emerald-900">
                  ${(task.approval === 'approved' && task.escrowStatus === 'released') ? 0 : (task.payment || 0)}
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

            {/* Action Buttons - Contributor View */}
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
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' ? (
            <div className="px-8 py-6 space-y-8">

              {/* 🔥 PRIORITY 1: Work Submitted for Review */}
              {isCreator && isUnderReview && (task?.prLink || task?.workDescription) && (
                <div className="p-6 bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 rounded-2xl border-2 border-teal-300/60 shadow-md">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-teal-200/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-lg animate-pulse">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            Work Submitted for Review
                          </h3>
                          <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full animate-pulse">
                            Action Required
                          </span>
                        </div>
                        <p className="text-sm text-teal-700 mt-1">
                          Review and approve the contributor's submission
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">

                    {/* PR Link */}
                    {task?.prLink && (
                      <div className="bg-white rounded-xl p-5 border-2 border-teal-100">
                        <div className="flex items-center gap-2 mb-3">
                          <ExternalLink className="w-4 h-4 text-teal-700" />
                          <span className="text-sm font-bold">Pull Request Link</span>
                        </div>
                        <a
                          href={task.prLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-teal-700 underline break-all"
                        >
                          {task.prLink}
                        </a>
                      </div>
                    )}

                    {/* Work Description */}
                    {task?.workDescription && (
                      <div className="bg-white rounded-xl p-5 border-2 border-teal-100">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-teal-700" />
                          <span className="text-sm font-bold">Work Summary</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {task.workDescription}
                        </p>
                      </div>
                    )}

                    {/* 🔥 ACTION BUTTONS (REDUCED SIZE) */}
                    <div className="flex gap-3 pt-2">

                      {/* Approve Button */}
                      <button
                        onClick={() => setShowApproveModal(true)}
                        disabled={isSubmittingApproval}
                        className="
      flex-1 px-6 py-4
      bg-gradient-to-r from-emerald-600 to-teal-600
      text-sm font-bold text-white
      rounded-xl
      hover:from-emerald-700 hover:to-teal-700
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all shadow-md hover:scale-[1.02]
    "
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4.5 h-4.5" />
                          {isSubmittingApproval ? 'Processing Payment...' : 'Approve & Complete Payment'}
                        </span>
                      </button>

                      {/* Request Changes Button */}
                      <button
                        onClick={() => setShowFeedbackModal(true)}
                        disabled={isSubmittingApproval}
                        className="
      flex-1 px-6 py-4
      bg-gradient-to-r from-orange-600 to-red-600
      text-sm font-bold text-white
      rounded-xl
      hover:from-orange-700 hover:to-red-700
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all shadow-md hover:scale-[1.02]
    "
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          <AlertCircle className="w-4.5 h-4.5" />
                          Request Changes
                        </span>
                      </button>
                    </div>

                    {/* Info Note */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                      <p className="text-xs text-blue-700">
                        <strong>Note:</strong> Approving will release the remaining balance of $
                        {((task.payment || 0) - ((task.approval === 'approved' && task.escrowStatus === 'released') ? (task.payment || 0) : 0)).toFixed(2)}
                      </p>
                    </div>

                  </div>
                </div>
              )}


              {/* 🟠 PRIORITY 2: Improvement Feedback - Show if needs changes */}
              {needsImprovement && task?.feedback && (
                <div className="p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-300 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-bold text-orange-900">Changes Requested by Creator</p>
                        <span className="px-2 py-0.5 bg-orange-600 text-white text-xs font-bold rounded-full uppercase">
                          Action Needed
                        </span>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-orange-200 mt-3">
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{task.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#006b5b] rounded-full"></div>
                  Task Description
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              {/* Acceptance Criteria */}
              {acceptanceCriteria && acceptanceCriteria.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#006b5b] rounded-full"></div>
                      Acceptance Criteria
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500"
                          style={{ width: `${(completedCount / totalCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {completedCount}/{totalCount}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {acceptanceCriteria.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleToggleCriteria(i)}
                        disabled={isSavingCriteria || isCreator}
                        className="w-full group"
                      >
                        <div className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${item.completed
                          ? 'border-emerald-300 bg-emerald-50/80'
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
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#006b5b] rounded-full"></div>
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
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-[#006b5b] bg-white transition-all group ${!isUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#006b5b] transition-colors" />
                          <span className="flex-1 text-sm text-gray-700 truncate">{fileName}</span>
                          {isUrl && <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#006b5b] transition-colors" />}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Activity tab content remains the same
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
        </div >
        {/* Comment Input - Sticky Bottom */}
        < div className="flex-shrink-0 border-t border-gray-200 bg-white px-8 py-4" >
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
        </div >

        {/* Feedback Modal */}
        {
          showFeedbackModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold mb-4">Request Improvement</h3>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Explain what needs to be improved..."
                  rows={5}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowFeedbackModal(false);
                      setFeedbackText('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestImprovement}
                    disabled={!feedbackText.trim() || isSubmittingApproval}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
                  >
                    Send Feedback
                  </button>
                </div>
              </div>
            </div>
          )
        }
        <ConfirmModal
          open={showApproveModal}
          title="Approve Task & Release Payment?"
          message={`Are you sure you want to approve this task? This will release the full payment of $${task.payment} to the contributor. This action cannot be undone.`}
          confirmText="Approve & Pay"
          onConfirm={() => handleApprove(task.id)}
          onCancel={() => setShowApproveModal(false)}
        />
      </div >
    </>
  );
}

const isValidUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};