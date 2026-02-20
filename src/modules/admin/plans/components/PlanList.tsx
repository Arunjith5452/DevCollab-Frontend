"use client";

import { useState, useEffect } from "react";
import { getAllPlans, togglePlanStatus, Plan } from "@/modules/admin/services/plans.api";
import { Edit, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/shared/utils/ErrorMessage";

interface PlanListProps {
    onEdit: (plan: Plan) => void;
    refreshTrigger: number;
}

export const PlanList = ({ onEdit, refreshTrigger }: PlanListProps) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const data = await getAllPlans();
            setPlans(data);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [refreshTrigger]);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await togglePlanStatus(id);
            toast.success(`Plan ${currentStatus ? "deactivated" : "activated"} successfully`);
            fetchPlans();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Duration</th>
                        <th className="px-6 py-3">Limits</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {plans.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                No plans found. Create one to get started.
                            </td>
                        </tr>
                    ) : (
                        plans.map((plan) => (
                            <tr key={plan.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-medium">
                                    <div>{plan.name}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{plan.description}</div>
                                </td>
                                <td className="px-6 py-4">₹{plan.price}</td>
                                <td className="px-6 py-4">{plan.durationInDays} days</td>
                                <td className="px-6 py-4">
                                    <div className="text-xs">
                                        <div>Projects: {plan.projectLimit ?? 1}</div>
                                        <div>Contributors: {plan.maxContributors ?? 4}</div>
                                        <div>Join: {plan.participationLimit ?? 1}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${plan.isActive
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                            }`}
                                    >
                                        {plan.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                                            className={`p-2 rounded-md transition-colors ${plan.isActive
                                                ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                }`}
                                            title={plan.isActive ? "Deactivate" : "Activate"}
                                        >
                                            {plan.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                        </button>
                                        <button
                                            onClick={() => onEdit(plan)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                            title="Edit Plan"
                                        >
                                            <Edit size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
