"use client";

import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface UnauthorizedPageProps {
    title?: string;
    message?: string;
    /** Where the "Go Home" button navigates to */
    redirectTo?: string;
}

/**
 * Full-page 403 Unauthorized error screen.
 * Shown when a user navigates to a route they don't have permission for.
 */
export default function UnauthorizedPage({
    title = "Access Denied",
    message = "You don't have permission to view this page.",
    redirectTo = "/home",
}: UnauthorizedPageProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-red-100 flex items-center justify-center shadow-inner">
                            <ShieldX className="w-14 h-14 text-red-500" strokeWidth={1.5} />
                        </div>
                        {/* Decorative ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping opacity-30" />
                    </div>
                </div>

                {/* Error code */}
                <p className="text-7xl font-black text-red-100 select-none mb-2" aria-hidden="true">
                    403
                </p>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>

                {/* Message */}
                <p className="text-gray-500 text-base mb-8 leading-relaxed">{message}</p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                    <button
                        onClick={() => router.push(redirectTo)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors shadow-sm"
                    >
                        <Home className="w-4 h-4" />
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
