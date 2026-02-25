"use client";

import UserManagement from "@/modules/admin/components/user-management";
import AdminRouteGuard from "@/shared/common/guards/AdminRouteGuard";

export default function UserManagementPage() {
    return (
        <AdminRouteGuard>
            <UserManagement />
        </AdminRouteGuard>
    );
}