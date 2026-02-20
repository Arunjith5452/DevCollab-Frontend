"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useUserStore';
import { useSession } from 'next-auth/react';

const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const user = useAuthStore((state) => state.user);
    const fetchUser = useAuthStore((state) => state.fetchUser);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'authenticated' && !user) {
            fetchUser();
        }
    }, [status, user, fetchUser]);

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'authenticated' && user) {
            // Check if subscription exists and is active
            const hasActiveSubscription = user.subscription?.status === 'active';
            const isSubscriptionPage = pathname === '/subscription';

            if (!hasActiveSubscription && !isSubscriptionPage) {
                router.push('/subscription');
            }
        }
    }, [status, user, pathname, router]);

    return <>{children}</>;
};

export default SubscriptionGuard;
