import api from "@/lib/axios"
import { TASK_ROUTERS } from "@/shared/constant/routes"
import { CreateTaskPayload } from "../types/task.types";


export const createTask = async (data: CreateTaskPayload) => {

    try {
        const response = await api.post(TASK_ROUTERS.CREATE_TASK, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const getAssignees = async (projectId: string) => {
    try {
        const response = await api.get(`${TASK_ROUTERS.GET_ASSIGNEES}/${projectId}`)
        return response

    } catch (error) {
        throw error
    }
}

export const addComment = async (taskId: string, message: string) => {
    try {
        const response = await api.patch(`${TASK_ROUTERS.ADD_COMMENT}/${taskId}/comment`, { message });
        return response.data;
    } catch (error) {
        throw error;
    }
}



// export const createPaymentIntent = async (amount: number, currency: string = 'INR', metadata?: Record<string, string>) => {
//     try {
//         const response = await api.post(TASK_ROUTERS.CREATE_PAYMENT, { amount, currency, metadata });
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// }

// services/task.api.ts or payment.api.ts
export const createCheckoutSession = async (data: { amount: number; metadata: Record<string, string> }) => {
    const response = await api.post(TASK_ROUTERS.CREATE_CHECKOUT_SESSION, data);
    return response.data;
};

export const getCreatorTasks = async (params: { projectId: string; page?: number; limit?: number; search?: string; status?: string; assignee?: string }) => {
    try {
        const response = await api.get(TASK_ROUTERS.CREATE_TASK, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}