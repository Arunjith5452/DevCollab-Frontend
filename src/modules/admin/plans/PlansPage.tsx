"use client";

import { useState } from "react";
import { Sidebar, Header } from "@/shared/common/admin-common";
import { PlanList } from "./components/PlanList";
import { SubscriptionList } from "./components/SubscriptionList";
import { CreatePlanModal } from "./components/CreatePlanModal";
import { EditPlanModal } from "./components/EditPlanModal";
import { Plan } from "../services/plans.api";
import { Plus, CreditCard, Users, Download } from "lucide-react";

export const PlansPage = () => {
    const [activeTab, setActiveTab] = useState<'subscriptions' | 'plans'>('subscriptions');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
    };

    const handleSuccess = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar activeItem="plans" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    title="Plans & Subscriptions"
                    subtitle="Manage subscription plans and view subscriber history"
                />

                <main className="flex-1 p-8 overflow-auto">
                    {/* Tabs and Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                            <button
                                onClick={() => setActiveTab('subscriptions')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'subscriptions'
                                    ? 'bg-teal-50 text-teal-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Users size={16} />
                                <span>Subscriptions</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('plans')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'plans'
                                    ? 'bg-teal-50 text-teal-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <CreditCard size={16} />
                                <span>Manage Plans</span>
                            </button>
                        </div>

                        {activeTab === 'plans' && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all font-medium shadow-md shadow-teal-600/20"
                            >
                                <Plus size={18} />
                                <span>Create Plan</span>
                            </button>
                        )}

                    </div>

                    {/* Content */}
                    <div className="relative">
                        {activeTab === 'subscriptions' ? (
                            <SubscriptionList />
                        ) : (
                            <PlanList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
                        )}
                    </div>

                    {/* Modals */}
                    <CreatePlanModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={handleSuccess}
                    />

                    <EditPlanModal
                        isOpen={!!editingPlan}
                        onClose={() => setEditingPlan(null)}
                        onSuccess={handleSuccess}
                        plan={editingPlan}
                    />
                </main>
            </div>
        </div>
    );
};
