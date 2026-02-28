"use client";

import { useSession, signOut } from "next-auth/react";
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


export default function AuthCallbackPage() {

    const { data } = useSession() as { data: CustomSession | null | undefined, status: string };
    const router = useRouter();
    const { status } = useSession();


    useEffect(() => {
        if (status !== 'authenticated' || !data?.user?.email) return;

        const provider = data.user.provider.toLowerCase();
        const providerId = data.user.id;

        const githubUrl = data.user.githubUrl

        if (!provider) {
            console.error(`Provider not found in session.`);
            signOut({ redirect: false }).then(() => router.replace("/login?error=unsupported"));
            return;
        }

        let backendEndpoint = "";
        let userIdFieldName = "";

        if (provider === 'github') {
            backendEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github/callback`;
            userIdFieldName = "githubId";
        } else if (provider === 'google') {
            backendEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/callback`;
            userIdFieldName = "googleId";
        } else {
            console.error(`Unsupported provider: ${provider}`);
            signOut({ redirect: false }).then(() => router.replace("/login?error=unsupported"));
            return;
        }

        const commonPayload = {
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
        };
        const finalPayload = {
            ...commonPayload,
            [userIdFieldName]: providerId,
            ...(provider === 'github' && githubUrl && { githubUrl: githubUrl }),
            ...(provider === 'github' && data.user.accessToken && { githubAccessToken: data.user.accessToken }),
        };


        async function sendToBackend() {
            try {
                await axios.post(
                    backendEndpoint,
                    finalPayload,
                    { withCredentials: true }
                );

                try {
                    const { useAuthStore } = await import('@/store/useUserStore');
                    await useAuthStore.getState().fetchUser(true);

                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (err) {
                    console.error("Failed to fetch user profile post-login", err);
                }

                window.location.href = "/home";

            } catch (error) {
                console.error(`Login via ${provider} failed.`, error);
                signOut({ redirect: false }).then(() => {
                    window.location.href = "/login?error=auth_failed";
                });
            }
        }

        sendToBackend();
    }, [data, status, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <PageLoader />
        </div>
    );
}