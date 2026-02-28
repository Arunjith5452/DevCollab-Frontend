"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X} from "lucide-react";
import { editPlan, Plan } from "@/modules/admin/services/plans.api";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils/ErrorMessage";
import { PlanFeature, PLAN_FEATURE_LABELS } from "@/shared/constants/plan-features";

interface EditPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    plan: Plan | null;
}

export const EditPlanModal = ({ isOpen, onClose, onSuccess, plan }: EditPlanModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        durationInDays: "",
        features: [] as PlanFeature[],
        projectLimit: "1",
        maxContributors: "4",
        participationLimit: "1"
    });

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name || "",
                description: plan.description || "",
                price: (plan.price ?? 0).toString(),
                durationInDays: (plan.durationInDays ?? 30).toString(),
                features: plan.features && plan.features.length > 0 ? plan.features as PlanFeature[] : [],
                projectLimit: (plan.projectLimit ?? 1).toString(),
                maxContributors: (plan.maxContributors ?? 4).toString(),
                participationLimit: (plan.participationLimit ?? 1).toString()
            });
        }
    }, [plan]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleFeature = (feature: PlanFeature) => {
        setFormData((prev) => {
            const isSelected = prev.features.includes(feature);
            const newFeatures = isSelected
                ? prev.features.filter((f) => f !== feature)
                : [...prev.features, feature];
            return { ...prev, features: newFeatures };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plan) return;

        if (!formData.name || formData.price === "" || !formData.durationInDays) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            await editPlan(plan.id, {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                durationInDays: Number(formData.durationInDays),
                features: formData.features,
                projectLimit: Number(formData.projectLimit),
                maxContributors: Number(formData.maxContributors),
                participationLimit: Number(formData.participationLimit),
            });
            toast.success("Plan updated successfully");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
                <Dialog.Content className="fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background p-6 rounded-lg shadow-xl z-50 border border-border animate-scale-in max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <Dialog.Title className="text-xl font-semibold">Edit Plan</Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-muted-foreground hover:text-foreground">
                                <X size={24} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Plan Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none min-h-[80px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Duration (Days) *</label>
                                <input
                                    type="number"
                                    name="durationInDays"
                                    value={formData.durationInDays}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Project Limit</label>
                                <input
                                    type="number"
                                    name="projectLimit"
                                    value={formData.projectLimit}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                                    min="1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Join Limit</label>
                                <input
                                    type="number"
                                    name="participationLimit"
                                    value={formData.participationLimit}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                                    min="1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Max Contributors</label>
                                <input
                                    type="number"
                                    name="maxContributors"
                                    value={formData.maxContributors}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Include Features</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border border-border rounded-md bg-muted/30">
                                {Object.values(PlanFeature).map((feature) => (
                                    <label key={feature} className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.features.includes(feature)}
                                                onChange={() => toggleFeature(feature)}
                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </div>
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                            {feature === "CREATE_PROJECTS"
                                                ? `can create ${formData.projectLimit} project${Number(formData.projectLimit) > 1 ? 's' : ''}`
                                                : feature === "JOIN_PROJECTS"
                                                    ? `can join ${formData.participationLimit} project${Number(formData.participationLimit) > 1 ? 's' : ''}`
                                                    : feature === "MAX_CONTRIBUTORS"
                                                        ? `max ${formData.maxContributors} contributors in a project`
                                                        : PLAN_FEATURE_LABELS[feature]}
                                        </span>

                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
