'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Calendar, DollarSign, Upload, Check } from 'lucide-react';
import { Header } from '@/shared/common/user-common/Header';
import { createTask } from '../services/task.api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/shared/utils/ErrorMessage';

export default function CreateTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const projectId = searchParams.get('projectId');
  const projectId = '6912bf4bfd6a31a7a45fe477'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    acceptanceCriteria: [] as Array<{ text: string; completed: boolean }>,
    payment: 0,
    advancePaid: 0,
    assignedTo: '',
    deadline: '',
    tags: [] as string[],
    status: 'todo',
    files: [] as File[]
  });

  const [tagInput, setTagInput] = useState('');
  const [criteriaInput, setCriteriaInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  const predefinedTags = ['Frontend', 'React', 'UIUX'];
  const teamMembers = ['John Doe', 'Sarah Smith', 'Mike Johnson', 'Emily Brown', 'David Lee'];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(tagInput.trim())) {
        setSelectedTags([...selectedTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCriteria = () => {
    if (criteriaInput.trim()) {
      setFormData({
        ...formData,
        acceptanceCriteria: [...formData.acceptanceCriteria, { text: criteriaInput.trim(), completed: false }]
      });
      setCriteriaInput('');
    }
  };

  const handleRemoveCriteria = (index: number) => {
    setFormData({
      ...formData,
      acceptanceCriteria: formData.acceptanceCriteria.filter((_, i) => i !== index)
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSelectAssignee = (member: string) => {
    setFormData({ ...formData, assignedTo: member });
    setShowAssigneeDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      title: formData.title.trim(),
      projectId,
      description: formData.description.trim(),
      assignedTo: formData.assignedTo,
      deadline: formData.deadline,
      status: formData.status,
      tags: selectedTags,
      documents: uploadedFiles.map(f => f.name),
      acceptanceCriteria: formData.acceptanceCriteria.map(c => ({
        text: c.text.trim(),
        completed: Boolean(c.completed),
      })),
      ...(formData.payment > 0 && {
        payment: {
          amount: Number(formData.payment),
          advancePaid: Number(formData.advancePaid),
        }
      })
    }

    console.log("FINAL PAYLOAD →", taskData)

    try {
      const response = await createTask(taskData);
      console.log("Success:", response);
      toast.success("Task created successfully!");
      router.push(`/tasks?projectId=${projectId}`);
    } catch (error) {
      getErrorMessage(error)
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header user={{ name: 'User' }} />

      <main className="pt-20 px-4 md:px-8 lg:px-40 pb-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#0c1d1a] mb-8">Create New Task</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                required
                className="w-full px-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent"
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Task Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the task in detail..."
                rows={5}
                className="w-full px-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent resize-none"
              />
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
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTags.includes(tag)
                      ? 'bg-[#006b5b] text-white'
                      : 'bg-[#e6f4f2] text-[#0c1d1a] hover:bg-[#cdeae5]'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Custom Tags */}
              {selectedTags.filter(tag => !predefinedTags.includes(tag)).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags
                    .filter(tag => !predefinedTags.includes(tag))
                    .map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-200"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-teal-100 rounded-full p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}

              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="Type custom tag and press Enter"
                className="w-full px-4 py-2 border border-[#cdeae5] rounded-lg text-[#0c1d1a] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent text-sm"
              />
            </div>

            {/* Acceptance Criteria */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-3">
                Acceptance Criteria
              </label>

              {formData.acceptanceCriteria.length > 0 && (
                <div className="space-y-2 mb-4 p-4 bg-[#f0faf8] rounded-lg border border-[#cdeae5]">
                  {formData.acceptanceCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <Check className="w-5 h-5 text-[#006b5b] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-[#0c1d1a]">{criteria.text}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCriteria(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-[#6b7280] hover:text-red-600" />
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
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCriteria())}
                  placeholder="Add acceptance criteria and press Enter"
                  className="flex-1 px-4 py-2 border border-[#cdeae5] rounded-lg text-[#0c1d1a] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCriteria}
                  className="px-4 py-2 bg-[#e6f4f2] text-[#0c1d1a] rounded-lg hover:bg-[#cdeae5] font-medium text-sm transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Payment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                  Payment Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                  <input
                    type="number"
                    value={formData.payment}
                    onChange={(e) => setFormData({ ...formData, payment: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-12 pr-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                  Advance Payment
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                  <input
                    type="number"
                    value={formData.advancePaid}
                    onChange={(e) => setFormData({ ...formData, advancePaid: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    max={formData.payment}
                    className="w-full pl-12 pr-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-[#6b7280] mt-1">Balance: ${(formData.payment - formData.advancePaid).toFixed(2)}</p>
              </div>
            </div>

            {/* Assigned To Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Assigned To
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  className="w-full px-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent text-left bg-white hover:bg-[#f0faf8] transition-colors"
                >
                  {formData.assignedTo || 'Select a team member'}
                </button>

                {showAssigneeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 border border-[#cdeae5] rounded-lg bg-white shadow-lg z-10">
                    {teamMembers.map((member) => (
                      <button
                        key={member}
                        type="button"
                        onClick={() => handleSelectAssignee(member)}
                        className={`w-full px-4 py-3 text-left hover:bg-[#e6f4f2] transition-colors ${formData.assignedTo === member ? 'bg-[#e6f4f2] text-[#006b5b] font-medium' : 'text-[#0c1d1a]'
                          }`}
                      >
                        {member}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Deadline Date */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Deadline Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-[#cdeae5] rounded-lg text-[#0c1d1a] focus:outline-none focus:ring-2 focus:ring-[#006b5b] focus:border-transparent bg-white"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="improvement-needed">Improvement Needed</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-[#0c1d1a] mb-3">
                Documents & Attachments
              </label>

              {uploadedFiles.length > 0 ? (
                <div className="mb-4 p-4 bg-[#f0faf8] rounded-lg border border-[#cdeae5]">
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-[#cdeae5] group">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Upload className="w-4 h-4 text-[#006b5b] flex-shrink-0" />
                          <span className="text-sm text-[#0c1d1a] truncate">{file.name}</span>
                          <span className="text-xs text-[#6b7280] flex-shrink-0">({(file.size / 1024).toFixed(2)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-[#6b7280] hover:text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-6 border-2 border-dashed border-[#cdeae5] rounded-lg text-center bg-[#f0faf8]">
                  <Upload className="w-8 h-8 text-[#cdeae5] mx-auto mb-2" />
                  <p className="text-[#6b7280] text-sm">No documents attached</p>
                  <p className="text-xs text-[#6b7280] mt-1">Upload files related to this task</p>
                </div>
              )}


              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="inline-block px-6 py-3 bg-[#e6f4f2] text-[#006b5b] rounded-lg font-semibold hover:bg-[#cdeae5] transition-colors cursor-pointer text-sm">
                  Upload Documents
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-[#cdeae5] text-[#0c1d1a] rounded-lg font-semibold hover:bg-[#f8fcfb] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#006b5b] text-white rounded-lg font-semibold hover:bg-[#005a4d] transition-colors"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}