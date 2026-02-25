"use client";

import ProjectManagement from "@/modules/admin/components/Project-mangement";
import AdminRouteGuard from "@/shared/common/guards/AdminRouteGuard";

export default function ProjectManagementPage() {
    return (
        <AdminRouteGuard>
            <ProjectManagement />
        </AdminRouteGuard>
    );
}