import api from "@/lib/axios";
import { PLAN_ROUTES } from "@/shared/constants/routes";

export const getActivePlans = async () => {
    const response = await api.get(PLAN_ROUTES.GET_ACTIVE_PLANS);
    return response.data;
};

export const createSubscriptionCheckoutSession = async (
    priceId?: string,
    planId?: string
): Promise<{ url: string; id: string }> => {
    interface CheckoutSessionPayload {
        mode: "payment" | "subscription";
        success_url: string;
        cancel_url: string;
        paymentType: 'SUBSCRIPTION';
        planId?: string;
        priceId?: string;
    }

    const payload: CheckoutSessionPayload = {
        mode: planId ? "payment" : "subscription", // Plans are one-time payments
        success_url: `${window.location.origin}/home?subscription_success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/subscription?canceled=true`,
        paymentType: 'SUBSCRIPTION', // Explicitly set payment type
    };

    if (planId) {
        payload.planId = planId;
    } else if (priceId) {
        payload.priceId = priceId;
    }

    const response = await api.post("/api/payment/checkout-session", payload);
    return response.data;
};
