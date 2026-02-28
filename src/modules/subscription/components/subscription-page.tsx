"use client";

import React, { useState, useEffect } from 'react';
import { createSubscriptionCheckoutSession, getActivePlans } from '../services/subscription.api';
import { useUser, useAuthStore } from '@/store/useUserStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, Crown, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageLoader from '@/shared/common/LoadingComponent';

interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    features: string[];
    isActive: boolean;
    type: 'one-time';
    projectLimit: number;
    maxContributors: number;
    participationLimit: number;
}


const SubscriptionPage = () => {
    const user = useUser();
    const fetchUser = useAuthStore((state) => state.fetchUser);
    const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const data = await getActivePlans();
                const plansArray = data?.plans || [];
                const sortedPlans = [...plansArray].sort((a: Plan, b: Plan) => a.price - b.price);
                setPlans(sortedPlans);
            } catch (error) {

                console.error("Failed to load plans", error);
                toast.error("Failed to load subscription plans");
            } finally {
                setPageLoading(false);
            }
        }
        loadPlans();
    }, []);

    useEffect(() => {
        if (searchParams.get('success')) {
            setTimeout(() => {
                fetchUser(true);
            }, 2000);
            toast.success("Subscription updated successfully!");
        }
        if (searchParams.get('canceled')) {
            toast.error("Subscription cancelled.");
        }
    }, [searchParams, fetchUser]);

    const handleSubscriptionModel = async (plan: Plan) => {
        try {
            setLoadingPlanId(plan.id);
            const session = await createSubscriptionCheckoutSession(undefined, plan.id);
            if (plan.price === 0) {
                await fetchUser(true);
                toast.success("Free plan activated successfully!");
                router.push('/');
            } else if (session?.url) {
                window.location.href = session.url;
            }
        } catch (error) {
            console.error("Failed to start checkout:", error);
            handleError(error);
        } finally {
            setLoadingPlanId(null);
        }
    };

    const handleError = (error: unknown) => {
        if (typeof error === 'object' && error !== null && 'response' in error) {
            const err = error as { response: { data: { message: string } } };
            if (err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
                return;
            }
        }
        toast.error("An unexpected error occurred.");
    }


    const isCurrentPlan = (planName: string, isFreePlan: boolean) => {
        if (user?.subscription?.status === 'active') {
            if (user.subscription.plan) {
                return user.subscription.plan.toLowerCase() === planName.toLowerCase();
            }
        }

        return isFreePlan;
    };


    if (pageLoading) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 overflow-hidden text-white pt-20">
            {/* Back Button */}
            <button
                onClick={() => router.push('/home')}
                className="absolute top-6 left-6 z-50 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all hover:scale-105"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>


            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-overlay filter blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-overlay filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200 mb-6">
                            Unlock Your Full Potential
                        </h2>
                        <p className="text-xl text-green-100/90 leading-relaxed">
                            Choose a plan that fits your needs. All plans include 24/7 support.
                        </p>
                    </motion.div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">



                    {plans.map((plan, index) => {
                        const isFree = plan.price === 0;
                        const isCurrent = isCurrentPlan(plan.name, isFree);

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                                className="relative group"
                            >
                                <div className={`absolute -inset-1 rounded-3xl blur transition duration-500 ${isFree ? 'bg-gradient-to-r from-green-400/30 to-emerald-500/30 opacity-0 group-hover:opacity-40' : 'bg-gradient-to-r from-amber-400 to-orange-500 opacity-30 group-hover:opacity-60'}`}></div>

                                <div className={`relative backdrop-blur-xl rounded-3xl p-8 h-full flex flex-col overflow-hidden ${isFree ? 'bg-white/5 border border-white/20 shadow-xl' : 'bg-gradient-to-b from-gray-900/90 to-black/90 border border-amber-500/30'}`}>
                                    {/* Popular Badge Logic */}
                                    {!isFree && index === 1 && (
                                        <div className="absolute top-0 right-0">
                                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl shadow-lg flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> FEATURED
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Crown className={`w-6 h-6 ${isFree ? 'text-green-300' : 'text-amber-400'}`} />
                                            <h3 className="text-2xl font-bold text-white truncate" title={plan.name}>{plan.name}</h3>
                                        </div>
                                        <p className="text-gray-300 text-sm line-clamp-2">{plan.description}</p>
                                    </div>

                                    <div className="flex items-baseline mb-8">
                                        <span className={`text-5xl font-extrabold text-transparent bg-clip-text ${isFree ? 'bg-gradient-to-r from-white to-green-100' : 'bg-gradient-to-r from-amber-300 to-orange-400'}`}>
                                            ₹{plan.price}
                                        </span>
                                        <span className="text-xl text-gray-400 ml-2">/{isFree ? 'forever' : `${plan.durationInDays}d`}</span>
                                    </div>

                                    <ul className="space-y-4 mb-8 flex-1">
                                        {plan.features.map((feature, i) => {
                                            const getFeatureLabel = (feat: string) => {
                                                switch (feat) {
                                                    case "CREATE_PROJECTS":
                                                        return `can create ${plan.projectLimit} project${plan.projectLimit > 1 ? 's' : ''}`;
                                                    case "JOIN_PROJECTS":
                                                        return `can join ${plan.participationLimit} project${plan.participationLimit > 1 ? 's' : ''}`;
                                                    case "MAX_CONTRIBUTORS":
                                                        return `max ${plan.maxContributors} contributors in a project`;
                                                    default:
                                                        return feat;
                                                }

                                            };

                                            return (
                                                <li key={i} className="flex items-center text-gray-200">
                                                    <div className={`rounded-full p-1 mr-3 ${isFree ? 'bg-green-500/30' : 'bg-amber-500/20'}`}>
                                                        {isFree ? <Check className="w-3 h-3 text-green-300" /> : <Zap className="w-3 h-3 text-amber-400" />}
                                                    </div>
                                                    <span className="text-sm">{getFeatureLabel(feature)}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>


                                    <button
                                        onClick={() => handleSubscriptionModel(plan)}
                                        disabled={loadingPlanId === plan.id || isCurrent}
                                        className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                                            ${isCurrent
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 cursor-default'
                                                : isFree
                                                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                                    : 'text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:scale-[1.02] active:scale-[0.98] hover:shadow-orange-500/25'
                                            }
                                        `}
                                    >
                                        {loadingPlanId === plan.id ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                                        ) : isCurrent ? (
                                            <><Check className="w-5 h-5" /> Current Plan</>
                                        ) : (
                                            <>Choose Plan <Sparkles className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}

                </div>

                <div className="mt-16 text-center">
                    <p className="text-green-200/60 text-sm">
                        Secure payment powered by Stripe. Cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
