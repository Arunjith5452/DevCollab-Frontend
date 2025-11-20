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
            backendEndpoint = "http://localhost:3001/api/auth/github/callback";
            userIdFieldName = "githubId";
        } else if (provider === 'google') {
            backendEndpoint = "http://localhost:3001/api/auth/google/callback";
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
        };


        async function sendToBackend() {
            try {
                await axios.post(
                    backendEndpoint,
                    finalPayload,
                    { withCredentials: true }
                );

                router.replace("/home");

            } catch (error) {
                console.error(`Login via ${provider} failed.`, error);
                signOut({ redirect: false }).then(() => {
                    router.replace("/login?error=auth_failed");
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