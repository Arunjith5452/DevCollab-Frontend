"use client";

import { useEffect, useState } from "react";
import { Badge, DataTable, Header, Pagination, Sidebar } from "@/shared/common/admin-common";
import { ChevronDown, Download } from "lucide-react";
import { getAllUsers, updateUserStatus } from "../services/admin.api";
import { SearchInput } from "@/shared/common/Searching";
import toast from "react-hot-toast";
import PageLoader from "@/shared/common/LoadingComponent";


export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: "user" | "creator" | "contributer" | "maintainer" | "admin";
  status: "active" | "block";
  createdAt: string;
}


export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("users");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newStatus, setNewStatus] = useState<"block" | "active" | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers({
          search: searchTerm,
          role: roleFilter,
          status: statusFilter,
          page: currentPage,
        });
        setUsers(data.users);
        setTotalPages(data.total);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter, currentPage]);

  const confirmAction = (user: User) => {
    setSelectedUser(user);
    setNewStatus(user.status === "block" ? "active" : "block");
    setShowConfirmModal(true);
  };

  const handleBlockUnblock = async () => {
    if (!selectedUser || !newStatus) return;
    try {
      await updateUserStatus({ userId: selectedUser._id, newStatus });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, status: newStatus } : user
        )
      );
      toast.success(
        `User ${newStatus === "block" ? "blocked" : "unblocked"} successfully`
      );
    } catch (error) {
      console.error("Failed to update user status");
    } finally {
      setShowConfirmModal(false);
      setSelectedUser(null);
      setNewStatus(null);
    }
  };

  const columns = [
    {
      label: "Name",
      render: (row: User) => (
        <span className="text-sm font-semibold text-gray-900">{row.name}</span>
      ),
    },
    {
      label: "Email",
      render: (row: User) => (
        <span className="text-sm text-teal-600">{row.email}</span>
      ),
    },
    {
      label: "Role",
      render: (row: User) => <Badge variant="info">{row.role}</Badge>,
    },
    {
      label: "Status",
      render: (row: User) => (
        <Badge variant={row.status === "block" ? "danger" : "success"}>
          {row.status === "block" ? "Blocked" : "Active"}
        </Badge>
      ),
    },
    {
      label: "Joined Date",
      render: (row: User) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      label: "Actions",
      render: (row: User) => (
        <button
          onClick={() => confirmAction(row)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all
            ${row.status === "block"
              ? "border-green-500 text-green-700 hover:bg-green-50"
              : "border-red-500 text-red-700 hover:bg-red-50"
            }`}
        >
          {row.status === "block" ? "Unblock User" : "Block User"}
        </button>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="User Management"
          subtitle="Manage and oversee all users within the platform."
          actions={
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-medium text-gray-700">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          }
        />

        <main className="flex-1 p-8 overflow-auto">

          <div className="bg-teal-50 rounded-2xl p-6 mb-6 border border-teal-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search users by name or email"
              />

              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-teal-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="creator">Creator</option>
                  <option value="contributer">Contributer</option>
                  <option value="maintainer">Maintainer</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-teal-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="block">Blocked</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="relative z-0 min-h-150">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/10 backdrop-blur-sm rounded-2xl">
                <PageLoader />
              </div>
            ) : (
              <DataTable<User> columns={columns} data={users} />
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      {showConfirmModal && (
        <>
          {/* Dark backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowConfirmModal(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96">
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {newStatus === "block" ? "Block" : "Unblock"} User
              </h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to{" "}
                <span className="font-semibold">{selectedUser?.name}</span>?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockUnblock}
                  className={`px-6 py-3 rounded-xl text-white font-bold transition ${newStatus === "block"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  Yes, {newStatus === "block" ? "Block" : "Unblock"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
