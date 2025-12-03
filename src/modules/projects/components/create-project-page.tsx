"use client"
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Upload, Link as LinkIcon, X, Plus } from 'lucide-react';
import { Header } from '@/shared/common/user-common/Header';
import { createProject } from '../services/project.api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getErrorMessage } from '@/shared/utils/ErrorMessage';
import { useS3Upload } from '@/shared/hooks/uses3Upload';


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
    image?: string | null
}

export default function CreateProjectPage() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [techStackItems, setTechStackItems] = useState<string[]>([]);
    const [techStackInput, setTechStackInput] = useState('');


    let router = useRouter()

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const { data } = await api.get('/api/profile/me', { withCredentials: true });
    //         } catch (error) {
    //             let err = error as Error
    //             console.error(err.message);
    //         }
    //     };
    //     fetchData();
    // }, [])


    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
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
            requiredRoles: [
                { roleName: '', requiredCount: '', experienceLevel: '' }
            ],
            image: null
        }
    });

    const { uploadToS3, fileUrl, loading, error } = useS3Upload()



    const { fields, append, remove } = useFieldArray({
        control,
        name: 'requiredRoles'
    });

    const skillLevel = watch('skillLevel');
    const isPublic = watch('isPublic');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await uploadToS3(file);
        if (url) {
            setUploadedImage(url);
            setValue("image", url);
        }
    };

    const handleAddRole = () => {
        append({ roleName: '', requiredCount: '', experienceLevel: '' });
    };

    const handleRemoveRole = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    const handleAddTechStack = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = techStackInput.trim();
            if (value && !techStackItems.includes(value)) {
                const updatedStack = [...techStackItems, value];
                setTechStackItems(updatedStack);
                setValue('techStack', updatedStack.join(', '));
                setTechStackInput('');
                e.currentTarget.focus()
            }
        }
    };

    const handleRemoveTechStack = (indexToRemove: number) => {
        const updatedStack = techStackItems.filter((_, index) => index !== indexToRemove);
        setTechStackItems(updatedStack);
        setValue('techStack', updatedStack.join(', '));
    };

    const onSubmit = async (data: ProjectFormData) => {
        const formattedPayload = {
            title: data.title,
            description: data.description,
            githubRepo: data.githubRepo,
            techStack: data.techStack
                .split(",")
                .map(item => item.trim()),
            difficulty: data.skillLevel,
            startDate: data.startDate,
            endDate: data.endDate,
            expectation: data.expectations,
            visibility: data.isPublic ? "public" : "private",
            requiredRoles: data.requiredRoles.map((role) => ({
                role: role.roleName,
                count: role.requiredCount,
                experience: role.experienceLevel,
            })),
            image: uploadedImage
        };

        try {
            const response = await createProject(formattedPayload);
            toast.success("Project Created Successfully")
            router.push('/project-list')
        } catch (error) {
            const message = getErrorMessage(error);
            console.log(message)
        }
    }

    return (
        <>
            <Header user={{ name: "Arunjith" }} />

            <main className="pt-20 min-h-screen bg-gray-50">
                <div className="max-w-3xl mx-auto px-6 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Create a New Project
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Upload Project Image */}
                        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8">
                            <div className="text-center">

                                <div className="mb-4">
                                    {uploadedImage ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={uploadedImage}
                                                alt="Project"
                                                className="w-32 h-32 object-cover rounded-lg mx-auto"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setUploadedImage(null)}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                    )}
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Upload Project Image
                                </h3>

                                <p className="text-sm text-gray-500 mb-4">
                                    Drag and drop or click to upload
                                </p>

                                <label className="inline-block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <span className="cursor-pointer bg-teal-50 text-teal-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors inline-block">
                                        {loading ? "Uploading..." : "Upload Image"}
                                    </span>
                                </label>

                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            </div>
                        </div>

                        {/* Project Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Project Title
                            </label>
                            <input
                                type="text"
                                {...register('title', {
                                    required: 'Project title is required',
                                    minLength: { value: 3, message: 'Title must be at least 3 characters' }
                                })}
                                placeholder="Enter project title"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Description
                            </label>
                            <textarea
                                {...register('description', {
                                    required: 'Description is required',
                                    minLength: { value: 10, message: 'Description must be at least 10 characters' }
                                })}
                                rows={4}
                                placeholder='Describe about project'
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        {/* GitHub Repository */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                GitHub Repository (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    {...register('githubRepo', {
                                        pattern: {
                                            value: /^https?:\/\/.+/,
                                            message: 'Please enter a valid URL'
                                        }
                                    })}
                                    placeholder="Link to your repository"
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                                <LinkIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            {errors.githubRepo && (
                                <p className="text-red-500 text-sm mt-1">{errors.githubRepo.message}</p>
                            )}
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Tech Stack
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={techStackInput}
                                    onChange={(e) => setTechStackInput(e.target.value)}
                                    onKeyDown={handleAddTechStack}
                                    placeholder="Type a technology and press Enter (e.g., React, Node.js, Tailwind)"
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <Plus className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Chips */}
                            {techStackItems.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {techStackItems.map((tech, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-200 transition-all hover:bg-teal-100"
                                        >
                                            <span>{tech}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTechStack(index)}
                                                className="ml-1 hover:bg-teal-200 rounded-full p-0.5 transition-colors"
                                                aria-label={`Remove ${tech}`}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Hidden input for react-hook-form */}
                            <input
                                type="hidden"
                                {...register('techStack', {
                                    required: 'At least one tech stack is required',
                                    validate: () => techStackItems.length > 0 || 'At least one tech stack is required'
                                })}
                            />

                            <p className="text-xs text-gray-500 mt-3">
                                Press Enter after typing each technology
                            </p>

                            {errors.techStack && (
                                <p className="text-red-500 text-sm mt-1">{errors.techStack.message}</p>
                            )}
                        </div>


                        {/* Skill Level */}
                        <div>
                            <div className="flex items-center space-x-4">
                                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setValue('skillLevel', level)}
                                        className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${skillLevel === level
                                            ? 'bg-teal-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Start Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    {...register('startDate', {
                                        required: 'Start date is required',
                                        validate: (value) => {
                                            const endDate = watch("endDate");
                                            if (endDate && new Date(value) > new Date(endDate)) {
                                                return "Start date cannot be later than end date";
                                            }
                                            return true;
                                        },
                                    })}
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                            </div>
                            {errors.startDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                            )}
                        </div>

                        {/* End Date to Join */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                End Date to Join
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    {...register('endDate', {
                                        required: 'End date is required',
                                        validate: (value) => {
                                            const startDate = watch("startDate");
                                            if (startDate && new Date(value) < new Date(startDate)) {
                                                return "End date must be later than start date";
                                            }
                                            return true;
                                        },
                                    })}
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                            </div>
                            {errors.endDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                            )}
                        </div>

                        {/* Expectations */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Expectations from Team Members
                            </label>
                            <textarea
                                {...register('expectations', {
                                    required: 'Expectations are required'
                                })}
                                placeholder="Briefly describe what you expect from your team members"
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                            />
                            {errors.expectations && (
                                <p className="text-red-500 text-sm mt-1">{errors.expectations.message}</p>
                            )}
                        </div>

                        {/* Public Project Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-300">
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Public Project</p>
                                <p className="text-sm text-gray-500">
                                    Public projects are visible to everyone on the platform
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setValue('isPublic', !isPublic)}
                                className={`relative w-14 h-8 rounded-full transition-colors ${isPublic ? 'bg-teal-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                />
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
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRole(index)}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Role Name
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register(`requiredRoles.${index}.roleName`, {
                                                        required: 'Role name is required'
                                                    })}
                                                    placeholder="e.g., Frontend, Backend, Designer, Reviewer"
                                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                />
                                                {errors.requiredRoles?.[index]?.roleName && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.requiredRoles[index]?.roleName?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Required Count
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    {...register(`requiredRoles.${index}.requiredCount`, {
                                                        required: 'Count is required',
                                                        min: { value: 1, message: 'Must be at least 1' }
                                                    })}
                                                    placeholder="Enter team count"
                                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                />
                                                {errors.requiredRoles?.[index]?.requiredCount && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.requiredRoles[index]?.requiredCount?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Experience Level
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register(`requiredRoles.${index}.experienceLevel`, {
                                                        required: 'Experience level is required'
                                                    })}
                                                    placeholder="e.g., 1 year, 5 year, freshers"
                                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                />
                                                {errors.requiredRoles?.[index]?.experienceLevel && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.requiredRoles[index]?.experienceLevel?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleAddRole}
                                className="mt-4 flex items-center space-x-2 text-teal-600 font-medium hover:text-teal-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Role</span>
                            </button>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col space-y-3 pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-teal-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Project'}
                            </button>
                            <button
                                onClick={() => router.push("/home")}
                                type="button"
                                className="w-full bg-white text-gray-700 px-6 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
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