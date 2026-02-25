"use client";

import { Lock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccessDeniedBannerProps {
    title?: string;
    message?: string;
}

/**
 * Inline access-denied component, rendered inside an existing page layout.
 * Used in dashboard pages when the user is authenticated but not authorized
 * for the specific project (e.g., not the creator or not an approved member).
 */
export default function AccessDeniedBanner({
    title = "Access Denied",
    message = "You don't have permission to view this project's data.",
}: AccessDeniedBannerProps) {
    const router = useRouter();

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg border border-red-100 p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-red-400" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>

                {/* Message */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{message}</p>

                {/* Action */}
                <button
                    onClick={() => router.push("/home")}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors w-full"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Return to Home
                </button>
            </div>
        </div>
    );
}
