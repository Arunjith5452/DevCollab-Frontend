import api from "@/lib/axios";
import { PLAN_ROUTES } from "@/shared/constant/routes";

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    features: string[];
    isActive: boolean;
    type: 'one-time';
    projectLimit?: number;
    maxContributors?: number;
    participationLimit?: number;
}

export const getAllPlans = async () => {
    try {
        const response = await api.get(PLAN_ROUTES.GET_ALL_PLANS);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPlan = async (data: Omit<Plan, 'id' | 'isActive' | 'type'>) => {
    try {
        const response = await api.post(PLAN_ROUTES.CREATE_PLAN, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editPlan = async (id: string, data: Partial<Omit<Plan, 'id' | 'isActive' | 'type'>>) => {
    try {
        const response = await api.put(PLAN_ROUTES.EDIT_PLAN(id), data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const togglePlanStatus = async (id: string) => {
    try {
        const response = await api.patch(PLAN_ROUTES.TOGGLE_PLAN_STATUS(id));
        return response.data;
    } catch (error) {
        throw error;
    }
};
