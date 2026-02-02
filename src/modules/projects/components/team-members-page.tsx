'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import CreatorHeader from "@/shared/common/user-common/Creator-header";
import { CreatorSidebar } from "@/shared/common/user-common/Creator-sidebar";
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Member } from "@/modules/projects/types/project.types";
import api from '@/lib/axios';
import { SearchInput } from '@/shared/common/Searching';
import { DataTable } from '@/shared/common/DataTable';
import { Pagination } from '@/shared/common/Pagination';
import { getErrorMessage } from '@/shared/utils/ErrorMessage';
import { BackButton } from '@/shared/common/BackButton';

const RoleCell = ({ member, onRoleChange }: { member: Member, onRoleChange: (id: string, role: 'contributor' | 'maintainer') => Promise<void> }) => {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState<'contributor' | 'maintainer' | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggle = () => setOpen(prev => !prev);

    const selectRole = (role: 'contributor' | 'maintainer') => {
        if (role === member.role) {
            setOpen(false);
            return;
        }
        setPending(role);
    };

    const confirm = async () => {
        if (!pending) return;
        await onRoleChange(member.id, pending);
        setPending(null);
        setOpen(false);
    };

    const cancel = () => {
        setPending(null);
        setOpen(false);
    };

    return (
        <>
            <div className="relative inline-block">
                <button
                    ref={buttonRef}
                    onClick={toggle}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 capitalize shadow-sm transition-all"
                >
                    {member.role}
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div
                        className="fixed z-50 min-w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                        style={{
                            top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 8 + window.scrollY : 0,
                            left: buttonRef.current
                                ? buttonRef.current.getBoundingClientRect().left + window.scrollX
                                : 0,
                            transform: 'translateX(-50%) translateX(50%)',
                        }}
                    >
                        <div className="p-2">
                            {!pending ? (
                                <div className="py-2">
                                    {(['contributor', 'maintainer'] as const).map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => selectRole(role)}
                                            className="w-full px-4 py-2.5 text-left text-sm rounded-lg hover:bg-gray-100 flex items-center justify-between capitalize transition"
                                        >
                                            <span>{role}</span>
                                            {role === member.role && <span className="text-emerald-600 font-bold">Current</span>}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 pb-3">
                                    <p className="text-sm text-gray-700 mb-4">
                                        Change role to <span className="font-semibold capitalize">{pending}</span>?
                                    </p>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={cancel}
                                            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirm}
                                            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

type InitialData = {
    users: Member[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    currentSearch: string;
};

interface TeamMembersPageProps {
    initialData: InitialData;
    projectId: string;
}

export default function TeamMembersPage({ initialData, projectId }: TeamMembersPageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/api/profile/me', { withCredentials: true });
            } catch (error) {
                const err = error as Error
                console.error(err.message);
            }
        };
        fetchData();
    }, [])

    const [members, setMembers] = useState<Member[]>(initialData.users);
    const [currentPage, setCurrentPage] = useState(initialData.currentPage);
    const [totalPages, setTotalPages] = useState(initialData.totalPages);
    const [search, setSearch] = useState(initialData.currentSearch);
    const [loading, setLoading] = useState(false);

    // Sync URL + fetch new data
    const updateUrlAndFetch = useCallback(
        async (newSearch: string, newPage: number) => {
            const params = new URLSearchParams();
            if (newSearch) params.set("search", newSearch);
            if (newPage > 1) params.set("page", String(newPage));
            router.push(`${pathname}?${params.toString()}`);

            setLoading(true);
            try {
                const res = await api.get(`/api/projects/${projectId}/members`, {
                    params: { search: newSearch, page: newPage, limit: 10 },
                });

                const data = res.data;
                setMembers(data.data?.users || data.users || []);
                setTotalPages(data.data?.totalPages || 1);
                setCurrentPage(data.data?.currentPage || newPage);
            } catch (err) {
                const message = getErrorMessage(err)
                toast.error(message)
            } finally {
                setLoading(false);
            }
        },
        [projectId, pathname, router]
    );

    useEffect(() => {
        const urlSearch = searchParams.get("search")?.trim() || "";
        const urlPage = Number(searchParams.get("page")) || 1;

        if (urlSearch !== search || urlPage !== currentPage) {
            setSearch(urlSearch);
            setCurrentPage(urlPage);
        }
    }, [searchParams, search, currentPage]);

    useEffect(() => {
        if (search !== initialData.currentSearch || currentPage !== initialData.currentPage) {
            updateUrlAndFetch(search, currentPage);
        }
    }, [search, currentPage, initialData, updateUrlAndFetch]);

    const handlePageChange = (page: number) => {
        updateUrlAndFetch(search, page);
    };

    const handleRoleChange = async (memberId: string, newRole: 'contributor' | 'maintainer') => {
        try {
            await api.patch(`/projects/${projectId}/members/${memberId}/role`, { role: newRole });
            setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
            toast.success("Role updated");
        } catch (err) {
            const message = getErrorMessage(err)
            toast.error("Failed to update role");
        }
    };

    const handleRemove = async (memberId: string, name: string) => {
        if (!confirm(`Remove ${name} from the team?`)) return;
        try {
            await api.delete(`/projects/${projectId}/members/${memberId}`);
            setMembers(prev => prev.filter(m => m.id !== memberId));
            toast.success("Member removed");
        } catch (err) {
            toast.error("Failed to remove member");
        }
    };

    const columns = [
        { label: "Name", render: (m: Member) => <span className="font-medium">{m.name}</span> },
        { label: "Email", key: "email" as keyof Member },

        {
            label: 'Role',
            render: (m: Member) => <RoleCell member={m} onRoleChange={handleRoleChange} />
        },

        {
            label: "Actions",
            render: (m: Member) => (
                <button
                    onClick={() => handleRemove(m.id, m.name)}
                    className="text-red-600 hover:text-red-800 font-medium transition"
                >
                    Remove
                </button>
            ),
        },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <CreatorSidebar activeItem="members" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <CreatorHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <BackButton />

                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                            <div className="w-80">
                                <SearchInput value={search} onChange={setSearch} debounceTime={500} placeholder="Search members..." />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                            </div>
                        ) : members.length === 0 ? (
                            <p className="text-center py-12 text-gray-500">No members found</p>
                        ) : (
                            <>
                                <DataTable columns={columns} data={members} />

                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}