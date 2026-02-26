import SubscriptionPage from "@/modules/subscription/components/subscription-page";
import { Suspense } from "react";
import PageLoader from "@/shared/common/LoadingComponent";

export default function Page() {
    return (
        <Suspense fallback={<PageLoader />}>
            <SubscriptionPage />
        </Suspense>
    )
}
