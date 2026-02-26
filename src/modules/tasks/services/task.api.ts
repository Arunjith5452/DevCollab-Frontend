import api from "@/lib/axios"
import { TASK_ROUTERS } from "@/shared/constants/routes"
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
export const createCheckoutSession = async (data: {
    amount: number;
    metadata: Record<string, string>;
    success_url?: string;
    cancel_url?: string;
}) => {
    const response = await api.post(TASK_ROUTERS.CREATE_CHECKOUT_SESSION, data);
    return response.data;
}


export const getCreatorTasks = async (params: { projectId: string; page?: number; limit?: number; search?: string; status?: string; assignee?: string }) => {
    try {
        const response = await api.get(TASK_ROUTERS.CREATE_TASK, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProjectTasks = async (projectId: string, activeTab: string) => {
    try {
        const response = await api.get(`${TASK_ROUTERS.GET_PROJECT_TASKS}/${projectId}/tasks/${activeTab}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const assignTask = async (taskId: string, userId: string) => {
    try {
        const response = await api.patch(`${TASK_ROUTERS.ASSIGN_TASK}/${taskId}/assign`, { userId });
        return response;
    } catch (error) {
        throw error;
    }
}

export const startTask = async (taskId: string) => {
    try {
        const response = await api.patch(`${TASK_ROUTERS.START_TASK}/${taskId}/start`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const submitTaskWork = async (taskId: string, data: { prLink: string; workDescription: string }) => {
    try {
        const response = await api.patch(`${TASK_ROUTERS.SUBMIT_TASK_WORK}/${taskId}/done`, data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateTaskCriteria = async (taskId: string, acceptanceCriteria: { text: string; completed: boolean }[]) => {
    try {
        const response = await api.patch(`${TASK_ROUTERS.UPDATE_TASK_CRITERIA}/${taskId}/criteria`, { acceptanceCriteria });
        return response;
    } catch (error) {
        throw error;
    }
}

export const approveTask = async (taskId: string) => {
    try {
        const response = await api.patch(`${TASK_ROUTERS.APPROVE_TASK}/${taskId}/approve`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const requestTaskImprovement = async (taskId: string, feedBack: string) => {
    try {
        const response = await api.patch(`${TASK_ROUTERS.REQUEST_TASK_IMPROVEMENT}/${taskId}/request-improvement`, { feedBack });
        return response;
    } catch (error) {
        throw error;
    }
}