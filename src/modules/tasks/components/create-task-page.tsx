'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  X,
  Calendar,
  DollarSign,
  Upload,
  Check,
  ChevronDown,
  Search,
} from 'lucide-react';
import { Header } from '@/shared/common/user-common/Header';
import { createTask, getAssignees } from '../services/task.api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/shared/utils/ErrorMessage';
import { useS3Upload } from '@/shared/hooks/uses3Upload';

type TaskStatus = 'todo' | 'in-progress' | 'done' | 'improvement-needed';

interface Assignee {
  userId: string;
  name: string;
}

interface FormValues {
  title: string;
  description: string;
  assignedId: string;
  deadline: string;
  status: TaskStatus;
  tags: string[];
  acceptanceCriteria: { text: string; completed: boolean }[];
  payment?: { amount: number; advancePaid: number };
  documents?: string[];
}

export default function CreateTaskPage() {
  const router = useRouter();
  const projectId = useSearchParams().get('projectId');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      status: 'todo',
      tags: [],
      acceptanceCriteria: [],
      documents: [],
    },
  });

  const { uploadToS3 } = useS3Upload();

  const watchTags = watch('tags', []);
  const watchCriteria = watch('acceptanceCriteria', []);
  const watchPayment = watch('payment');
  const watchAssignedId = watch('assignedId');
  const watchDocuments = watch('documents') || [];

  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [criteriaInput, setCriteriaInput] = useState('');

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!projectId) return
    getAssignees(projectId)
      .then((r) => setAssignees(r.data || []))
      .catch(() => toast.error('Failed to load team members'));
  }, [projectId]);

  const predefinedTags = ['Frontend', 'React', 'UIUX', 'Backend'];

  const toggleTag = (tag: string) => {
    const newTags = watchTags.includes(tag)
      ? watchTags.filter((t) => t !== tag)
      : [...watchTags, tag];
    setValue('tags', newTags, { shouldValidate: true });
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const val = tagInput.trim();
    if (!val || watchTags.includes(val)) return;
    setValue('tags', [...watchTags, val], { shouldValidate: true });
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setValue('tags', watchTags.filter((t) => t !== tag), { shouldValidate: true });
  };

  const handleAddCriteria = () => {
    if (!criteriaInput.trim()) return;
    setValue(
      'acceptanceCriteria',
      [...watchCriteria, { text: criteriaInput.trim(), completed: false }],
      { shouldValidate: true }
    );
    setCriteriaInput('');
  };

  const handleRemoveCriteria = (index: number) => {
    setValue(
      'acceptanceCriteria',
      watchCriteria.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  // S3 Upload Handler - Fixed Logic
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
    setUploadingFiles(true);

    toast.loading(`Uploading ${files.length} file(s)...`, { id: 'upload-toast' });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

      try {
        const url = await uploadToS3(file);
        if (url) {
          uploadedUrls.push(url);
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
        } else {
          toast.error(`Failed to upload ${file.name}`);
          setUploadedFiles((prev) => prev.filter((f) => f.name !== file.name));
        }
      } catch (err) {
        toast.error(`Upload failed: ${file.name}`);
        setUploadedFiles((prev) => prev.filter((f) => f.name !== file.name));
      }
    }

    // Only add successful URLs
    if (uploadedUrls.length > 0) {
      setValue('documents', [...watchDocuments, ...uploadedUrls], {
        shouldValidate: true,
      });
    }

    setUploadingFiles(false);
    toast.dismiss('upload-toast');

    if (uploadedUrls.length === files.length) {
      toast.success('All files uploaded successfully!');
    } else if (uploadedUrls.length > 0) {
      toast.success(`${uploadedUrls.length} of ${files.length} files uploaded`);
    } else {
      toast.error('All uploads failed');
    }

    // Reset input
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    const file = uploadedFiles[index];
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setValue('documents', watchDocuments.filter((_, i) => i !== index), {
      shouldValidate: true,
    });
    setUploadProgress((prev) => {
      const { [file.name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSelectAssignee = (userId: string) => {
    setValue('assignedId', userId, { shouldValidate: true });
    setShowAssigneeDropdown(false);
    setAssigneeSearch('');
  };

  const getAssigneeLabel = () => {
    if (!watchAssignedId) return 'Select a team member';
    const found = assignees.find((a) => a.userId === watchAssignedId);
    return found?.name || 'Select a team member';
  };

  const filteredAssignees = assignees.filter((m) =>
    m.name.toLowerCase().includes(assigneeSearch.toLowerCase())
  );

  const onSubmit = async (data: FormValues) => {
    if (uploadingFiles) {
      toast.error('Please wait until all files are uploaded');
      return;
    }

    const payload: any = { ...data, projectId };

    if (!payload.documents?.length) delete payload.documents;
    if (!payload.payment?.amount) delete payload.payment;

    try {
      await createTask(payload);
      toast.success('Task created successfully!');
      router.push(`/task-listing?projectId=${projectId}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 px-4 md:px-8 lg:px-40 pb-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#0c1d1a] mb-8">
            Create New Task
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Task Title *
              </label>
              <input
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 3, message: 'Minimum 3 characters' },
                  maxLength: { value: 100, message: 'Maximum 100 characters' },
                })}
                placeholder="e.g., Build login page"
                className="w-full px-4 py-3 border border-[#cdeae5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006b5b]"
              />
              {errors.title && (
                <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Description *
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Minimum 10 characters' },
                })}
                rows={5}
                placeholder="Describe what needs to be done..."
                className="w-full px-4 py-3 border border-[#cdeae5] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#006b5b]"
              />
              {errors.description && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {predefinedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${watchTags.includes(tag)
                      ? 'bg-[#006b5b] text-white'
                      : 'bg-[#e6f4f2] text-[#0c1d1a] hover:bg-[#cdeae5]'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {watchTags
                  .filter((t) => !predefinedTags.includes(t))
                  .map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
              </div>

              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="Press Enter to add custom tag"
                className="w-full px-4 py-2 border border-[#cdeae5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006b5b]"
              />
            </div>

            {/* Acceptance Criteria */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-3">
                Acceptance Criteria
              </label>
              {watchCriteria.length > 0 && (
                <div className="space-y-2 mb-4 p-4 bg-[#f0faf8] rounded-lg border border-[#cdeae5]">
                  {watchCriteria.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <Check className="w-5 h-5 text-[#006b5b]" />
                      <span className="flex-1">{item.text}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCriteria(i)}
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4 text-gray-500 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={criteriaInput}
                  onChange={(e) => setCriteriaInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddCriteria())
                  }
                  placeholder="Add criteria + Enter"
                  className="flex-1 px-4 py-2 border border-[#cdeae5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006b5b]"
                />
                <button
                  type="button"
                  onClick={handleAddCriteria}
                  className="px-5 py-2 bg-[#e6f4f2] hover:bg-[#cdeae5] rounded-lg font-medium text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                  Payment Amount (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    step="0.01"
                    {...register('payment.amount', { valueAsNumber: true })}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 border border-[#cdeae5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006b5b]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                  Advance Paid
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    step="0.01"
                    {...register('payment.advancePaid', { valueAsNumber: true })}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 border border-[#cdeae5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006b5b]"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Balance: $
                  {((watchPayment?.amount || 0) - (watchPayment?.advancePaid || 0)).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Assigned To *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  className="w-full px-4 py-3 border border-[#cdeae5] rounded-lg text-left bg-white hover:bg-[#f0faf8] flex justify-between items-center"
                >
                  <span>{getAssigneeLabel()}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showAssigneeDropdown && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-[#cdeae5] rounded-lg shadow-lg max-h-64 overflow-auto">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Search member..."
                          value={assigneeSearch}
                          onChange={(e) => setAssigneeSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div>
                      {filteredAssignees.length > 0 ? (
                        filteredAssignees.map((m) => (
                          <button
                            key={m.userId}
                            type="button"
                            onClick={() => handleSelectAssignee(m.userId)}
                            className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] text-sm ${watchAssignedId === m.userId ? 'bg-[#e6f4f2] font-medium' : ''
                              }`}
                          >
                            {m.name}
                          </button>
                        ))
                      ) : (
                        <p className="text-center py-8 text-gray-500 text-sm">
                          No members found
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {errors.assignedId && (
                <p className="text-red-600 text-xs mt-1">
                  Please select an assignee
                </p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Deadline *
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  {...register('deadline', { required: 'Deadline is required' })}
                  className="w-full pl-12 pr-4 py-3 border border-[#cdeae5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006b5b]"
                />
              </div>
              {errors.deadline && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 border border-[#cdeae5] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006b5b]"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="improvement-needed">Improvement Needed</option>
              </select>
            </div>

            {/* File Upload Section - Now with (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-3">
                Documents & Attachments{' '}
                <span className="font-normal text-gray-500 text-xs">(Optional)</span>
              </label>

              {uploadedFiles.length > 0 ? (
                <div className="space-y-3 mb-4 p-4 bg-[#f0faf8] rounded-lg border border-[#cdeae5]">
                  {uploadedFiles.map((file, i) => {
                    const progress = uploadProgress[file.name] || 0;
                    const isDone = progress === 100;

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Upload
                            className={`w-5 h-5 ${isDone ? 'text-green-600' : 'text-[#006b5b]'}`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                              {progress > 0 && !isDone && ` • ${progress}%`}
                            </p>
                          </div>
                          {!isDone && (
                            <div className="w-ml-4 w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#006b5b] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          disabled={uploadingFiles}
                          className="ml-3 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-5 h-5 text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 border-2 border-dashed border-[#cdeae5] rounded-lg text-center bg-[#f9fcfb]">
                  <Upload className="w-12 h-12 text-[#cdeae5] mx-auto mb-3" />
                  <p className="text-gray-600">No files attached yet</p>
                  <p className="text-xs text-gray-500 mt-1">You can add files later if needed</p>
                </div>
              )}

              <label className="cursor-pointer inline-block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploadingFiles}
                  className="hidden"
                />
                <span className="px-6 py-3 bg-[#e6f4f2] text-[#006b5b] rounded-lg font-semibold hover:bg-[#cdeae5] text-sm inline-block transition">
                  {uploadingFiles ? 'Uploading...' : 'Upload Files'}
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 border border-[#cdeae5] rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || uploadingFiles}
                className="flex-1 py-3 bg-[#006b5b] text-white rounded-lg font-semibold hover:bg-[#005a4d] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting || uploadingFiles ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}