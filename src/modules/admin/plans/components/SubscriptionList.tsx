

"use client";

import { useState, useEffect } from "react";
import { getAllSubscriptions } from "@/modules/admin/services/admin.api";
import { Loader2, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { SearchInput } from "@/shared/common/Searching";
import toast from "react-hot-toast";

interface Subscription {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
    plan: string;
    status: 'active' | 'inactive' | 'cancelled' | 'expired';
    startDate: string;
    endDate: string;
    amount?: number; // Optional as it might not be in the direct projection if not added, but we added it
    createdAt: string;
}

const TABS = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Expired", value: "expired" },
];

export const SubscriptionList = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("");

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await getAllSubscriptions({ page, limit: 10, search: searchTerm, status: activeTab });
            const data = response.data?.subscriptions || response.subscriptions || response.data || [];
            const totalCount = response.data?.total || response.total || 0;

            setSubscriptions(data);
            setTotal(totalCount);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load subscriptions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [page, searchTerm, activeTab]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, activeTab]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>;
            case 'cancelled':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Cancelled</span>;
            case 'expired':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><Clock className="w-3 h-3 mr-1" /> Expired</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab.value
                                ? "bg-white text-teal-700 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="w-full md:w-1/3">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search user..."
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center p-4 sm:p-12 text-teal-600">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-teal-100 bg-white shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-teal-50 text-teal-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">User</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Plan</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Start Date</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">End Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-teal-50">
                            {subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 sm:py-12 text-center text-gray-500">
                                        No subscriptions found.
                                    </td>
                                </tr>
                            ) : (
                                subscriptions.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-teal-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs uppercase">
                                                    {sub.userId?.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{sub.userId?.name || 'Unknown'}</div>
                                                    <div className="text-xs text-gray-500">{sub.userId?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium capitalize">
                                            {sub.plan}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(sub.status)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(sub.startDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(sub.endDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {total > 10 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-teal-50">
                            <div className="text-xs text-gray-500">
                                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} entries
                            </div>
                            <div className="flex gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={page * 10 >= total}
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-1 text-xs font-medium text-teal-700 bg-teal-100 rounded-md hover:bg-teal-200 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
