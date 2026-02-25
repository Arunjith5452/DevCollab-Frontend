"use client";

import { useEffect, useState } from "react";
import { userProfile } from "@/modules/user/services/user.api";
import PageLoader from "@/shared/common/LoadingComponent";
import UnauthorizedPage from "./UnauthorizedPage";

interface AdminRouteGuardProps {
    children: React.ReactNode;
}

/**
 * Client-side guard for admin-only pages.
 * - While checking: shows a loading spinner
 * - If user is not admin: shows full UnauthorizedPage (403)
 * - If user is admin: renders children
 *
 * This is a secondary defense on top of the middleware role check.
 */
export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
    const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking");

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const res = await userProfile();
                const user = res.data;
                if (user?.role === "admin") {
                    setStatus("authorized");
                } else {
                    setStatus("unauthorized");
                }
            } catch {
                setStatus("unauthorized");
            }
        };

        checkAdminAccess();
    }, []);

    if (status === "checking") {
        return (
            <div className="flex h-screen items-center justify-center">
                <PageLoader />
            </div>
        );
    }

    if (status === "unauthorized") {
        return (
            <UnauthorizedPage
                title="Admin Access Required"
                message="You don't have admin privileges to access this area. If you believe this is a mistake, please contact support."
                redirectTo="/home"
            />
        );
    }

    return <>{children}</>;
}
