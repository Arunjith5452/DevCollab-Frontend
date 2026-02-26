"use client";

import { PlansPage } from "@/modules/admin/plans/PlansPage";
import AdminRouteGuard from "@/shared/common/guards/AdminRouteGuard";

export default function Page() {
    return (
        <AdminRouteGuard>
            <PlansPage />
        </AdminRouteGuard>
    );
}
