"use client";

// SubscriptionGuard: No automatic redirects.
// Users access the subscription page only via the navbar dropdown.
const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default SubscriptionGuard;
