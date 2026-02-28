"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PageLoader from "@/shared/common/LoadingComponent";
import { Session } from 'next-auth';

interface CustomSession extends Session {
    user: {
        id: string;
        provider: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
        githubUrl?: string | null
        accessToken?: string | null;
    };
}

export default function ConnectGitHubPage() {
    const { data, status } = useSession() as { data: CustomSession | null | undefined, status: string };
    const router = useRouter();

    useEffect(() => {
        if (status !== 'authenticated' || !data?.user?.accessToken) {
            router.replace("/create-project?error=no_token");
            return;
        }

        const sendTokenToBackend = async () => {
            try {

                const payload = {
                    githubAccessToken: data.user.accessToken,
                    githubUrl: data.user.githubUrl
                };

                await axios.patch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/users/connect-github`,
                    payload,
                    { withCredentials: true }
                );

                router.replace("/create-project?github_connected=true");
            } catch (error) {
                console.error("DEBUG: Failed to send token to backend", error);
                router.replace("/create-project?error=connection_failed");
            }
        };

        sendTokenToBackend();
    }, [data, status, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <PageLoader />
        </div>
    );
}
