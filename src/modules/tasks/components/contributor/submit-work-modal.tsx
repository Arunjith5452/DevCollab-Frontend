'use client';

import { useState } from 'react';
import { X, ExternalLink, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface SubmitWorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { prLink: string; workDescription: string }) => Promise<void>;
    isSubmitting: boolean;
}

export default function SubmitWorkModal({ isOpen, onClose, onSubmit, isSubmitting }: SubmitWorkModalProps) {
    const [prLink, setPrLink] = useState('');
    const [workDescription, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!prLink.trim()) {
            toast.error("PR link is required");
            return;
        }

        if (!workDescription.trim() || workDescription.trim().length < 10) {
            toast.error("Please provide a more detailed description (min 10 characters)");
            return;
        }

        onSubmit({ prLink, workDescription });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 z-10 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#0c1d1a]">Submit Work</h2>
                    <button onClick={onClose} className="text-[#6b7280] hover:text-[#0c1d1a]">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#0c1d1a] mb-1">GitHub PR Link</label>
                        <div className="relative">
                            <ExternalLink className="absolute left-3 top-3 w-4 h-4 text-[#6b7280]" />
                            <input
                                type="url"
                                required
                                value={prLink}
                                onChange={(e) => setPrLink(e.target.value)}
                                placeholder="https://github.com/..."
                                className="w-full pl-10 pr-4 py-2 border border-[#cdeae5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006b5b]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#0c1d1a] mb-1">Description</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-[#6b7280]" />
                            <textarea
                                required
                                value={workDescription}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what you've done..."
                                rows={4}
                                className="w-full pl-10 pr-4 py-2 border border-[#cdeae5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006b5b]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-[#cdeae5] text-[#0c1d1a] rounded-lg hover:bg-[#f8fcfb]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-[#006b5b] text-white rounded-lg font-semibold hover:bg-[#005a4d] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Work'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
