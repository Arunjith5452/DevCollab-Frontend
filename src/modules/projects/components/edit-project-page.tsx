"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Upload, Link as LinkIcon, X, Plus } from 'lucide-react';
import { Header } from '@/shared/common/user-common/Header';
import { editProject, getProjectForEdit } from '../services/project.api';
import toast from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import { getErrorMessage } from '@/shared/utils/ErrorMessage';
import { useS3Upload } from '@/shared/hooks/uses3Upload';
import PageLoader from '@/shared/common/LoadingComponent';
import { BackButton } from '@/shared/common/BackButton';

import { BaseProjectPayload, RequiredRole } from '@/modules/projects/types/project.types';

interface TeamRole {
    roleName: string;
    requiredCount: string;
    experienceLevel: string;
}

interface ProjectFormData {
    title: string;
    description: string;
    githubRepo: string;
    techStack: string;
    skillLevel: string;
    startDate: string;
    endDate: string;
    expectations: string;
    isPublic: boolean;
    requiredRoles: TeamRole[];
    image?: string | null;
}

export default function EditProjectPage() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [techStackItems, setTechStackItems] = useState<string[]>([]);
    const [techStackInput, setTechStackInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const params = useParams();
    const projectId = params?.id as string;

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ProjectFormData>({
        defaultValues: {
            title: '',
            description: '',
            githubRepo: '',
            techStack: '',
            skillLevel: 'Beginner',
            startDate: '',
            endDate: '',
            expectations: '',
            isPublic: false,
            requiredRoles: [{ roleName: '', requiredCount: '', experienceLevel: '' }],
            image: null
        }
    });

    const { uploadToS3, loading: uploadLoading, error: uploadError } = useS3Upload();
    const { fields, append, remove } = useFieldArray({ control, name: 'requiredRoles' });

    const skillLevel = watch('skillLevel');
    const isPublic = watch('isPublic');

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;

            try {
                setIsLoading(true);
                const response = await getProjectForEdit(projectId);
                console.log("response", response)

                if (!response?.data) {
                    toast.error('Project not found');
                    router.push('/project-list');
                    return;
                }

                const project = response.data;

                reset({
                    title: project.title || project._title || '',
                    description: project.description || project._description || '',
                    githubRepo: project.githubRepo || project._githubRepo || '',
                    techStack: '',
                    skillLevel: project.difficulty || project._difficulty || 'Beginner',
                    startDate: project.startDate || project._startDate
                        ? new Date(project.startDate || project._startDate).toISOString().split('T')[0]
                        : '',
                    endDate: project.endDate || project._endDate
                        ? new Date(project.endDate || project._endDate).toISOString().split('T')[0]
                        : '',
                    expectations: project.expectation || project._expectation || '',
                    isPublic: (project.visibility || project._visibility) === 'public',
                    requiredRoles: (project.requiredRoles || project._requiredRoles || []).map((role: RequiredRole & { roleName?: string, requiredCount?: number, experienceLevel?: string }) => ({
                        roleName: role.role || role.roleName || '',
                        requiredCount: (role.count || role.requiredCount || '').toString(),
                        experienceLevel: role.experience || role.experienceLevel || ''
                    })),
                    image: project.image || project._image || null
                });

                const techs = project.techStack || project._techStack || [];
                const techArray = Array.isArray(techs) ? techs : [];
                setTechStackItems(techArray);
                setValue('techStack', techArray.join(', '));

                if (project.image || project._image) {
                    setUploadedImage(project.image || project._image);
                }
            } catch (error) {
                toast.error(getErrorMessage(error) || 'Failed to load project');
                router.push('/project-list');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [projectId, reset, router, setValue]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await uploadToS3(file);
        if (url) {
            setUploadedImage(url);
            setValue('image', url);
        }
    };

    const handleAddTechStack = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = techStackInput.trim();
            if (value && !techStackItems.includes(value)) {
                const updated = [...techStackItems, value];
                setTechStackItems(updated);
                setValue('techStack', updated.join(', '));
                setTechStackInput('');
            }
        }
    };

    const handleRemoveTechStack = (index: number) => {
        const updated = techStackItems.filter((_, i) => i !== index);
        setTechStackItems(updated);
        setValue('techStack', updated.join(', '));
    };

    const onSubmit = async (data: ProjectFormData) => {
        const formattedPayload = {
            title: data.title.trim(),
            description: data.description.trim(),
            githubRepo: data.githubRepo?.trim() || '',
            techStack: techStackItems,
            difficulty: data.skillLevel,
            startDate: data.startDate,
            endDate: data.endDate,
            expectation: data.expectations.trim(),
            visibility: data.isPublic ? 'public' : 'private',
            requiredRoles: data.requiredRoles.map(role => ({
                role: role.roleName.trim(),
                count: role.requiredCount,
                experience: role.experienceLevel.trim(),
            })),
            image: uploadedImage || null,
        };

        try {
            await editProject({ projectId, data: formattedPayload });
            toast.success('Project updated successfully!');
            router.push('/project-list');
        } catch (error) {
            toast.error(getErrorMessage(error) || 'Failed to update project');
        }
    };

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <PageLoader />
            </div>
        );

    return (
        <>
            <Header />
            <main className="pt-20 min-h-screen bg-gray-50">
                <div className="px-6 lg:px-24 xl:px-40 py-6">
                    <BackButton />
                </div>
                <div className="max-w-3xl mx-auto px-6 pb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Project</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        {/* Upload Project Image */}
                        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8">
                            <div className="text-center">
                                <div className="mb-4">
                                    {uploadedImage ? (
                                        <div className="relative inline-block">
                                            <img src={uploadedImage} alt="Project" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUploadedImage(null);
                                                    setValue('image', null);
                                                }}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                    )}
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Project Image</h3>
                                <p className="text-sm text-gray-500 mb-4">Drag and drop or click to upload</p>

                                <label className="inline-block">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    <span className="cursor-pointer bg-teal-50 text-teal-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors">
                                        {uploadLoading ? 'Uploading...' : 'Upload Image'}
                                    </span>
                                </label>
                                {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                            </div>
                        </div>

                        {/* Project Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Project Title</label>
                            <input
                                type="text"
                                {...register('title', { required: 'Project title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' } })}
                                placeholder="Enter project title"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                            <textarea
                                {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Description must be at least 10 characters' } })}
                                rows={4}
                                placeholder="Describe your project"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        {/* GitHub Repository */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">GitHub Repository (Optional)</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    {...register('githubRepo', { pattern: { value: /^https?:\/\/.+/i, message: 'Please enter a valid URL' } })}
                                    placeholder="https://github.com/username/repo"
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                                <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            {errors.githubRepo && <p className="text-red-500 text-sm mt-1">{errors.githubRepo.message}</p>}
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Tech Stack</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={techStackInput}
                                    onChange={(e) => setTechStackInput(e.target.value)}
                                    onKeyDown={handleAddTechStack}
                                    placeholder="Type a technology and press Enter"
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Plus className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {techStackItems.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {techStackItems.map((tech, index) => (
                                        <div key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-200 hover:bg-teal-100">
                                            <span>{tech}</span>
                                            <button type="button" onClick={() => handleRemoveTechStack(index)} className="ml-1 hover:bg-teal-200 rounded-full p-0.5">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <input type="hidden" {...register('techStack', { required: 'At least one tech is required' })} />
                            <p className="text-xs text-gray-500 mt-3">Press Enter after typing each technology</p>
                        </div>

                        {/* Skill Level */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">Skill Level</label>
                            <div className="flex gap-4">
                                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setValue('skillLevel', level)}
                                        className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${skillLevel === level ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    {...register('startDate', { required: 'Start date is required' })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">End Date to Join</label>
                                <input
                                    type="date"
                                    {...register('endDate', { required: 'End date is required' })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                            </div>
                        </div>

                        {/* Expectations */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Expectations from Team Members</label>
                            <textarea
                                {...register('expectations', { required: 'Expectations are required' })}
                                rows={3}
                                placeholder="Briefly describe what you expect from your team members"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                            />
                            {errors.expectations && <p className="text-red-500 text-sm mt-1">{errors.expectations.message}</p>}
                        </div>

                        {/* Public Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-300">
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Public Project</p>
                                <p className="text-sm text-gray-500">Public projects are visible to everyone on the platform</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setValue('isPublic', !isPublic)}
                                className={`relative w-14 h-8 rounded-full transition-colors ${isPublic ? 'bg-teal-600' : 'bg-gray-300'}`}
                            >
                                <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isPublic ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>

                        {/* Team Roles */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Roles</h3>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="bg-gray-50 rounded-lg border border-gray-300 p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-sm font-semibold text-gray-700">Role {index + 1}</p>
                                            {fields.length > 1 && (
                                                <button type="button" onClick={() => remove(index)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <input
                                                {...register(`requiredRoles.${index}.roleName`, { required: 'Role name is required' })}
                                                placeholder="e.g., Frontend, Backend"
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                            <input
                                                type="number"
                                                min="1"
                                                {...register(`requiredRoles.${index}.requiredCount`, { required: 'Count is required', min: { value: 1, message: 'At least 1' } })}
                                                placeholder="Required count"
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                            <input
                                                {...register(`requiredRoles.${index}.experienceLevel`, { required: 'Experience level required' })}
                                                placeholder="e.g., 1+ year, fresher"
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => append({ roleName: '', requiredCount: '', experienceLevel: '' })}
                                className="mt-4 flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700"
                            >
                                <Plus className="w-4 h-4" /> Add Role
                            </button>
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col gap-4 pt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-teal-600 text-white py-4 rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 transition shadow-md"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Project'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/project-list')}
                                className="w-full bg-white text-gray-700 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}